const { createComment } = require('../helpers/comment.helper');
const approveCommand = require('./approve.command');

const mergeCommand = async context => {
	const params = context.pullRequest();
	const pullRequest = await context.octokit.pulls.get(params);

	if (!pullRequest.data.mergeable) {
		return createComment(context, ':warning: Pull request is not mergeable.');
	}

	const reviewParams = context.pullRequest();

	const reviews = await context.octokit.pulls.listReviews(reviewParams);

	const approvedReviews = reviews.data.filter(
		review => review.state === 'APPROVED'
	);

	if (approvedReviews.length === 0) {
		approveCommand(context);
	}

	const merge = context.pullRequest({
		commit_title: context.payload.issue.title,
		merge_method: 'squash',
	});

	context.octokit.pulls.merge(merge);
};

module.exports = mergeCommand;
