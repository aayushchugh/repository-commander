const { addLabel } = require('../helpers/label.helper');
const { listIssueLabels } = require('../helpers/listLabels.helper');

const addLabelToIssueOnClose = async context => {
	const issueLabels = await listIssueLabels(context);

	const previousBugLabel = issueLabels.data.find(label => label.name === 'bug');

	const previousFeatureLabel = issueLabels.data.find(
		label => label.name === 'feature' || label.name === 'enhancement'
	);

	if (previousBugLabel) {
		addLabel(['fixed'], context);
	}

	if (previousFeatureLabel) {
		addLabel(['implemented'], context);
	}
};

module.exports = addLabelToIssueOnClose;
