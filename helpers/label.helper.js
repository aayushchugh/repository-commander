const randomColor = require('randomcolor');
const { listRepoLabels } = require('./listLabels.helper');

/**
 * Add a label to an issue
 * @param {string[]} names - Array of label names to add
 * @param {*} context Probot context
 * @param {string | undefined} color  Label color
 */
exports.addLabel = async (names, context, color) => {
	const issueFromRepo = await listRepoLabels(context);

	names.forEach(name => {
		const label = issueFromRepo.data.find(label => label.name === name);

		if (!label) {
			if (color) this.createLabel(name, context, color);
			else this.createLabel(name, context);
		}
	});

	const newLabels = context.issue({
		labels: names,
	});

	context.octokit.issues.addLabels(newLabels);
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
