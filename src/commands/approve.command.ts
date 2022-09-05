import type { Context } from "probot";
import { createComment } from "../utils/comment.util";

async function approveCommand(context: Context<"issue_comment.created">) {
	const pullParams = context.pullRequest();

	// @ts-ignore
	createComment(
		context,
		`Approving changes of this pull_request as requested by @${context.payload.comment.user.login}`,
	);

	await context.octokit.pulls.createReview({
		...pullParams,
		event: "APPROVE",
	});
}

export default approveCommand;
