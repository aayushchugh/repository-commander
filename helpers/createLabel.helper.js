const randomColor = require('randomcolor');

const createLabel = (name, context, color) => {
	return context.octokit.issues.createLabel({
		name: name,
		owner: context.payload.repository.owner.login,
		repo: context.payload.repository.name,
		color: color || randomColor().split('#')[1],
	});
};

module.exports = createLabel;
