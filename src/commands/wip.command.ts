import type { Context } from "probot";
import Label from "../utils/label.util";

async function WIPCommand(context: Context<"issue_comment.created">) {
	const { title } = context.payload.issue;
	const label = new Label(context);

	const labelsFromIssues = await label.listIssueLabels();

	const wipLabel = labelsFromIssues.data.find((label) => label.name === "WIP");
	const foundReadyForReviewLabel = labelsFromIssues.data.find(
		(label) => label.name === "Ready for Review",
	);

	if (wipLabel) {
		if (!foundReadyForReviewLabel && context.payload.issue.pull_request) {
			label.add("Ready for Review");
		}

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

		label.remove("WIP");
	}

	if (!wipLabel) {
		if (foundReadyForReviewLabel) {
			label.remove("Ready for Review");
		}

		label.add("WIP", "383214");

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
}

export default WIPCommand;
