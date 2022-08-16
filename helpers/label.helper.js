const randomColor = require('randomcolor');
const { listRepoLabels, listIssueLabels } = require('./listLabels.helper');

/**
 * Add a label to an issue
 * @param {string[]} names - Array of label names to add
 * @param {*} context Probot context
 * @param {string | undefined} color  Label color
 */
exports.addLabel = async (names, context, color) => {
	const labelsFromRepo = await listRepoLabels(context);
	const labelsFromIssue = await listIssueLabels(context);

	names.forEach(name => {
		const labelFromRepo = labelsFromRepo.data.filter(
			label => label.name === name
		);

		const labelFromIssue = labelsFromIssue.data.filter(
			label => label.name === name
		);

		if (labelFromRepo.length === 0) {
			console.log('if');
			if (color) this.createLabel(name, context, color);
			else this.createLabel(name, context);
		}

		if (labelFromIssue.length === 0) {
			const newLabels = context.issue({
				labels: names,
			});

			context.octokit.issues.addLabels(newLabels);
		}
	});
};

/**
 * Create a label
 * @param {string} name - Label name
 * @param {string} color - Label color
 * @param {*} context Probot context
 */
exports.createLabel = (name, context, color) => {
	return context.octokit.issues.createLabel({
		name: name,
		owner: context.payload.repository.owner.login,
		repo: context.payload.repository.name,
		color: color || randomColor().split('#')[1],
	});
};

/**
 * Remove Label
 * @param {string} name - Label name
 * @param {*} context Probot context
 */
exports.removeLabel = (name, context) => {
	const issue = context.issue({ name });

	return context.octokit.issues.removeLabel(issue);
};
