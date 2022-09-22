import type { Context } from "probot";
import Comment from "../utils/comment.util";

function closeCommand(context: Context<"issue_comment.created">) {
	const params = context.issue();
	const comment = new Comment(context);

	comment.create(`Closing this issue as requested by @${context.payload.comment.user.login}`);

	context.octokit.issues.update({
		owner: params.owner,
		repo: params.repo,
		issue_number: params.issue_number,
		state: "closed",
	});
}

export default closeCommand;
