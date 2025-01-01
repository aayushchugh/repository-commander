import type { Context } from "probot";
import { createComment } from "../utils/comment.util";

export async function handleApproveCommand(context: Context<"issue_comment.created">) {
	if (!context.payload.issue.pull_request) {
		await createComment(context, "This command can only be used on pull requests.");
		return;
	}

	await createComment(
		context,
		`Approving changes of this pull_request as requested by @${context.payload.comment.user.login}`,
	);

	await context.octokit.pulls.createReview({
		...context.pullRequest(),
		event: "APPROVE",
	});
}
