import type { Context } from "probot";

function closeCommand(context: Context<"issue_comment.created">) {
	const params = context.issue();

	context.octokit.issues.update({
		owner: params.owner,
		repo: params.repo,
		issue_number: params.issue_number,
		state: "closed",
	});
}

export default closeCommand;
