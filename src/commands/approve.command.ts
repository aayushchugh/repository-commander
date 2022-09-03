import type { Context } from "probot";

async function approveCommand(context: Context<"issue_comment.created">) {
	const params = context.pullRequest();

	await context.octokit.pulls.createReview({
		owner: params.owner,
		pull_number: params.pull_number,
		repo: params.repo,
		event: "APPROVE",
	});
}

export default approveCommand;
