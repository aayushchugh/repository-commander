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
	const repoLabels = await listRepoLabels(context);
	const foundLabel = repoLabels.data.find(
		label => label.name === ':mag: Ready For Review'
	);

	if (!foundLabel) {
		createLabel(':mag: Ready For Review', context, '1B2337');
	}

	addLabel([':mag: Ready For Review'], context);
};

exports.addApprovedLabel = async context => {
	const params = context.pullRequest();

	const reviews = await context.octokit.pulls.listReviews(params);

	const approvedReviews = reviews.data.filter(
		review => review.state === 'APPROVED'
	);

	if (approvedReviews.length > 0) {
		const repoLabels = await listRepoLabels(context);
		const issueLabels = await listIssueLabels(context);

		const foundLabel = repoLabels.data.filter(
			label => label.name === ':white_check_mark: Approved'
		);

		const foundReviewLabel = issueLabels.data.filter(
			label => label.name === ':mag: Ready For Review'
		);

		if (foundLabel.length === 0) {
			createLabel(':white_check_mark: Approved', context, '0E2717');
		}

		addLabel([':white_check_mark: Approved'], context);

		if (foundReviewLabel.length > 0) {
			removeLabel([':mag: Ready For Review'], context);
		}
	}
};

exports.addMergedLabel = async context => {
	if (context.payload.pull_request.merged) {
		const repoLabels = await listRepoLabels(context);
		const issueLabels = await listIssueLabels(context);

		const foundLabel = repoLabels.data.filter(
			label => label.name === ':sparkles: Merged:'
		);

		const foundApproveLabel = issueLabels.data.filter(
			label => label.name === ':white_check_mark: Approved'
		);

		if (foundLabel.length === 0) {
			createLabel(':sparkles: Merged:', context, '1F1A36');
		}

		addLabel([':sparkles: Merged:'], context);

		if (foundApproveLabel.length > 0) {
			removeLabel([':white_check_mark: Approved'], context);
		}
	}
};
