const createLabel = require('../helpers/createLabel.helper');
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

	args.forEach(label => {
		const foundLabel = repoLabels.data.find(
			repoLabel => repoLabel.name === label
		);

		if (!foundLabel) {
			createLabel(label, context);
		}
	});

	const newLabels = context.issue({
		labels: args,
	});

	context.octokit.issues.addLabels(newLabels);
};

module.exports = labelCommand;
