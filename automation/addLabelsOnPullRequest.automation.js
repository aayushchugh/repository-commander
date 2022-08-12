const {
	createLabel,
	addLabel,
	removeLabel,
} = require('../helpers/label.helper');
const {
	listRepoLabels,
	listIssueLabels,
} = require('../helpers/listLabels.helper');

exports.addReadyForReviewLabel = async context => {
	addLabel([':mag: Ready For Review'], context);
};

exports.addApprovedLabel = async context => {
	const params = context.pullRequest();

	const reviews = await context.octokit.pulls.listReviews(params);

	const approvedReviews = reviews.data.filter(
		review => review.state === 'APPROVED'
	);

	if (approvedReviews.length > 0) {
		const issueLabels = await listIssueLabels(context);

		const foundReviewLabel = issueLabels.data.filter(
			label => label.name === ':mag: Ready For Review'
		);

		addLabel([':white_check_mark: Approved'], context);

		if (foundReviewLabel.length > 0) {
			removeLabel([':mag: Ready For Review'], context);
		}
	}
};

exports.addMergedLabel = async context => {
	if (context.payload.pull_request.merged) {
		const issueLabels = await listIssueLabels(context);

		const foundApproveLabel = issueLabels.data.filter(
			label => label.name === ':white_check_mark: Approved'
		);

		addLabel([':sparkles: Merged:'], context);

		if (foundApproveLabel.length > 0) {
			removeLabel([':white_check_mark: Approved'], context);
		}
	}
};
