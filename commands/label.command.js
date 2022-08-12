const {
	createLabel,
	removeLabel,
	addLabel,
} = require('../helpers/label.helper');
const {
	listRepoLabels,
	listIssueLabels,
} = require('../helpers/listLabels.helper');

/**
 * This is main function which will run on /label command
 *
 * @param {*} context  Probot context
 * @param {*} args  Arguments passed to the command
 */
const labelCommand = async (context, args) => {
	const repoLabels = await listRepoLabels(context);
	const issueLabels = await listIssueLabels(context);
	const labelsToAdd = [];

	args.forEach(label => {
		const foundRepoLabel = repoLabels.data.find(
			repoLabel => repoLabel.name === label
		);
		const foundIssueLabel = issueLabels.data.find(
			issueLabel => issueLabel.name === label
		);

		if (foundIssueLabel) {
			removeLabel(label, context);
		} else {
			labelsToAdd.push(label);
		}

		if (!foundRepoLabel) {
			createLabel(label, context);
		}
	});

	if (labelsToAdd.length > 0) {
		addLabel(labelsToAdd, context);
	}
};

module.exports = labelCommand;
