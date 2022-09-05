import type { Context } from "probot";
import { createComment } from "../utils/comment.util";

async function mergeCommand(context: Context<"issue_comment.created">) {
	const params = context.pullRequest();
	const pullRequest = await context.octokit.pulls.get(params);

	if (!pullRequest.data.mergeable) {
		// @ts-ignore
		return createComment(context, ":warning: Pull request is not mergeable.");
	}

	createComment(
		context,
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
