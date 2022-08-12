const randomColor = require('randomcolor');

exports.addLabel = (names, context) => {
	const newLabels = context.issue({
		labels: names,
	});

	context.octokit.issues.addLabels(newLabels);
};

exports.createLabel = (name, context, color) => {
	return context.octokit.issues.createLabel({
		name: name,
		owner: context.payload.repository.owner.login,
		repo: context.payload.repository.name,
		color: color || randomColor().split('#')[1],
	});
};

exports.removeLabel = (name, context) => {
	return context.octokit.issues.removeLabel({
		name: name,
		owner: context.payload.repository.owner.login,
		repo: context.payload.repository.name,
		issue_number: context.payload.issue.number,
	});
};
