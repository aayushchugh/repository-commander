import type { Context } from "probot";
import { createComment } from "../utils/comment.util";
import approveCommand from "./approve.command";

async function mergeCommand(context: Context<"issue_comment.created">) {
	const params = context.pullRequest();
	const pullRequest = await context.octokit.pulls.get(params);

	if (!pullRequest.data.mergeable) {
		return createComment(context, ":warning: Pull request is not mergeable.");
	}

	const reviewParams = context.pullRequest();

	const reviews = await context.octokit.pulls.listReviews(reviewParams);

	const approvedReviews = reviews.data.filter(
		review => review.state === "APPROVED"
	);

	if (approvedReviews.length === 0) {
		approveCommand(context);
	}

	context.octokit.pulls.merge({
		owner: params.owner,
		repo: params.repo,
		pull_number: params.pull_number,
		merge_method: "rebase",
	});
}

export default mergeCommand;
