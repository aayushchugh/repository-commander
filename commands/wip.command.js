const { addLabel, removeLabel } = require("../helpers/label.helper");
const { listIssueLabels } = require("../helpers/listLabels.helper");

const WIPCommand = async context => {
	const { title } = context.payload.issue || context.payload.pull_request;
	const labelsFromIssues = await listIssueLabels(context);

	const wipLabel = labelsFromIssues.data.find(
		label => label.name === ":construction: WIP"
	);
	const foundReadyForReviewLabel = labelsFromIssues.data.find(
		label => label.name === ":mag: Ready for Review"
	);

	if (
		title.includes("WIP") ||
		title.includes("Work In Progress") ||
		title.includes("work in progress") ||
		title.includes(":construction:")
	) {
		const params = context.issue({
			title: `${context.payload.issue.title.replace(":construction:", "")}`,
		});

		context.octokit.issues.update(params);
	}

	if (wipLabel) {
		if (!foundReadyForReviewLabel) {
			addLabel([":mag: Ready for Review"], context);
		}

		return removeLabel(":construction: WIP", context);
	}

	if (!wipLabel) {
		if (foundReadyForReviewLabel) {
			removeLabel(":mag: Ready for Review", context);
		}

		addLabel([":construction: WIP"], context, "383214");
	}

	if (
		!title.includes("WIP") ||
		!title.includes("Work In Progress") ||
		!title.includes("work in progress") ||
		!title.includes(":construction:")
	) {
		const params = context.issue({
			title: `:construction: ${context.payload.issue.title}`,
		});

		context.octokit.issues.update(params);
	}
};

module.exports = WIPCommand;
