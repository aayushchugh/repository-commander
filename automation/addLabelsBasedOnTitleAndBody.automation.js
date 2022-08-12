const { addLabel, removeLabel } = require('../helpers/label.helper');
const {
	listRepoLabels,
	listIssueLabels,
} = require('../helpers/listLabels.helper');

const addLabelsBasedOnTitleAndBody = async context => {
	const { body, title } = context.payload.issue || context.payload.pull_request;

	const repoLabels = await listRepoLabels(context);
	const issueLabels = await listIssueLabels(context);
	const foundWIPLabel = issueLabels.data.find(
		label => label.name === ':construction: WIP'
	);

	title.split(' ').forEach(word => {
		const foundRepoLabel = repoLabels.data.find(label => label.name === word);

		if (
			word === 'WIP' ||
			word === 'work in progress' ||
			word === 'Work In Progress' ||
			word === ':construction:'
		) {
			addLabel([':construction: WIP'], context, '383214');
		}

		if (foundRepoLabel) addLabel([word], context);
	});

	if (
		!title.includes('WIP') &&
		!title.includes(':construction:') &&
		!title.includes('work in progress') &&
		!title.includes('Work In Progress') &&
		foundWIPLabel
	) {
		removeLabel([':construction: WIP'], context);
	}

	if (body) {
		body.split(' ').forEach(word => {
			const foundRepoLabel = repoLabels.data.find(label => label.name === word);

			if (foundRepoLabel) {
				addLabel([word], context);
			}
		});
	}
};

module.exports = addLabelsBasedOnTitleAndBody;
