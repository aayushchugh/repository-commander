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
	const { title } = context.payload.pull_request;

	if (context.payload.pull_request.merged) {
		const issueLabels = await listIssueLabels(context);

		const foundApproveLabel = issueLabels.data.filter(
			label => label.name === ':white_check_mark: Approved'
		);
		const foundWIPLabel = issueLabels.data.filter(
			label => label.name === ':construction: WIP'
		);

		addLabel([':sparkles: Merged:'], context);

		if (foundApproveLabel.length > 0) {
			removeLabel([':white_check_mark: Approved'], context);
		}

		if (foundWIPLabel.length > 0) {
			removeLabel([':construction: WIP'], context);
		}
		console.log(title);

		if (
			title.includes('WIP') ||
			title.includes('Work In Progress') ||
			title.includes('work in progress') ||
			title.includes(':construction:')
		) {
			const params = context.pullRequest({
				title: `${title.replace(':construction:', '')}`,
			});

			context.octokit.pulls.update(params);
		}
	}
};
