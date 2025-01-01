import type { Context } from "probot";
import { createComment } from "../utils/comment.util";
import { hasWriteAccess } from "../utils/permissions.util";
import { addLabel, removeLabel } from "../utils/label.util";
import { getConfig } from "../utils/config.util";

export async function handleApproveCommand(context: Context<"issue_comment.created">) {
	if (!context.payload.issue.pull_request) {
		await createComment(context, "This command can only be used on pull requests.");
		return;
	}

	const canApprove = await hasWriteAccess(context);
	if (!canApprove) {
		await createComment(
			context,
			"Sorry, only users with write access can approve pull requests.",
		);
		return;
	}

	await createComment(context, `Pull request approved by @${context.payload.comment.user.login}`);

	await context.octokit.pulls.createReview({
		...context.pullRequest(),
		event: "APPROVE",
	});
}
