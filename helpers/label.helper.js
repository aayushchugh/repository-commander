const randomColor = require('randomcolor');

/**
 * Add a label to an issue
 * @param {string[]} names - Array of label names to add
 * @param {*} context Probot context
 */
exports.addLabel = (names, context) => {
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
