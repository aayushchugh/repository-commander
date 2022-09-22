import type { Context } from "probot";
import Comment from "../utils/comment.util";

async function mergeCommand(context: Context<"issue_comment.created">) {
	const params = context.pullRequest();
	const pullRequest = await context.octokit.pulls.get(params);

	const comment = new Comment(context);

	if (!pullRequest.data.mergeable) {
		// @ts-ignore
		return comment.create(":warning: Pull request is not mergeable.");
	}

	comment.create(
		`Merging this pull_request as requested by @${context.payload.comment.user.login}`,
	);

	context.octokit.pulls.merge({
		owner: params.owner,
		repo: params.repo,
		pull_number: params.pull_number,
		merge_method: "rebase",
	});
}

export default mergeCommand;
