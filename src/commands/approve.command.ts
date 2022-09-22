import type { Context } from "probot";
import Comment from "../utils/comment.util";

async function approveCommand(context: Context<"issue_comment.created">) {
	const pullParams = context.pullRequest();
	const comment = new Comment(context);

	// @ts-ignore
	comment.create(
		`Approving changes of this pull_request as requested by @${context.payload.comment.user.login}`,
	);

	await context.octokit.pulls.createReview({
		...pullParams,
		event: "APPROVE",
	});
}

export default approveCommand;
