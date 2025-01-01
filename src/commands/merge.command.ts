import type { Context } from "probot";
import { createComment } from "../utils/comment.util";
import { hasWriteAccess } from "../utils/permissions.util";

export async function handleMergeCommand(context: Context<"issue_comment.created">) {
	try {
		if (!context.payload.issue.pull_request) {
			await createComment(context, "This command can only be used on pull requests.");
			return;
		}

		const canMerge = await hasWriteAccess(context);
		if (!canMerge) {
			await createComment(
				context,
				"Sorry, only users with write access can merge pull requests.",
			);
			return;
		}

		const pullRequest = await context.octokit.pulls.get(context.pullRequest());

		// Check if PR is already merged
		if (pullRequest.data.merged) {
			await createComment(context, "This pull request is already merged.");
			return;
		}

		// Check if PR is closed
		if (pullRequest.data.state === "closed") {
			await createComment(context, "This pull request is closed. Please reopen it first.");
			return;
		}

		// Check for required status checks
		const { data: checks } = await context.octokit.checks.listForRef({
			...context.repo(),
			ref: pullRequest.data.head.sha,
		});

		const pendingChecks = checks.check_runs.filter(
			(check) => check.status !== "completed" || check.conclusion !== "success",
		);

		if (pendingChecks.length > 0) {
			await createComment(
				context,
				"Cannot merge: Some status checks are pending or failing.",
			);
			return;
		}

		if (!pullRequest.data.mergeable) {
			await createComment(
				context,
				"This pull request cannot be merged right now. Please resolve conflicts first.",
			);
			return;
		}

		await createComment(
			context,
			`Merging pull request as requested by @${context.payload.comment.user.login}`,
		);

		await context.octokit.pulls.merge(context.pullRequest());
	} catch (error) {
		console.error("Error in handleMergeCommand:", error);
		await createComment(context, "An error occurred while trying to merge the pull request.");
	}
}
