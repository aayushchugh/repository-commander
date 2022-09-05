import type { Context } from "probot";
import { addLabel, removeLabel } from "../utils/label.util";
import { listIssueLabels } from "../utils/listLabels.util";

async function WIPCommand(context: Context<"issue_comment.created">) {
	const { title } = context.payload.issue;
	// @ts-ignore
	const labelsFromIssues = await listIssueLabels(context);

	const wipLabel = labelsFromIssues.data.find((label) => label.name === ":construction: WIP");
	const foundReadyForReviewLabel = labelsFromIssues.data.find(
		(label) => label.name === ":mag: Ready for Review",
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
		if (!foundReadyForReviewLabel && context.payload.issue.pull_request) {
			addLabel([":mag: Ready for Review"], context);
		}

		removeLabel(":construction: WIP", context);
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
}

export default WIPCommand;
