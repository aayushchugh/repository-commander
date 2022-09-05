import type { Context } from "probot";
import { createComment } from "../utils/comment.util";

function closeCommand(context: Context<"issue_comment.created">) {
	const params = context.issue();

	// @ts-ignore
	createComment(
		context,
		`Closing this issue as requested by @${context.payload.comment.user.login}`
	);

	context.octokit.issues.update({
		owner: params.owner,
		repo: params.repo,
		issue_number: params.issue_number,
		state: "closed",
	});
}

export default closeCommand;
