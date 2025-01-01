import type { Context } from "probot";
import { createComment } from "../utils/comment.util";
import { hasWriteAccess } from "../utils/permissions.util";

export async function handleMergeCommand(context: Context<"issue_comment.created">) {
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
}
