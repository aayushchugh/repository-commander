const {
	createLabel,
	addLabel,
	removeLabel,
} = require('../helpers/label.helper');
const {
	listRepoLabels,
	listIssueLabels,
} = require('../helpers/listLabels.helper');

const approveCommand = async context => {
	const review = context.pullRequest({
		event: 'APPROVE',
	});

	await context.octokit.pulls.createReview(review);
};

module.exports = approveCommand;
