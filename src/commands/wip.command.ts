import type { Context } from "probot";
import { addLabel, removeLabel, listLabelsOnIssue } from "../utils/label.util";

export async function handleWIPCommand(context: Context<"issue_comment.created">) {
	const { title } = context.payload.issue;
	const labelsFromIssues = await listLabelsOnIssue(context);

	const wipLabel = labelsFromIssues.data.find((label) => label.name === "WIP");
	const foundReadyForReviewLabel = labelsFromIssues.data.find(
		(label) => label.name === "Ready for Review",
	);

	if (wipLabel) {
		if (!foundReadyForReviewLabel && context.payload.issue.pull_request) {
			await addLabel(context, "Ready for Review");
		}

		if (
			title.includes("WIP") ||
			title.includes("Work In Progress") ||
			title.includes("work in progress") ||
			title.includes(":construction:")
		) {
			await context.octokit.issues.update({
				...context.issue(),
				title: context.payload.issue.title.replace(":construction:", ""),
			});
		}

		await removeLabel(context, "WIP");
	} else {
		if (foundReadyForReviewLabel) {
			await removeLabel(context, "Ready for Review");
		}

		await addLabel(context, "WIP", "383214");

		if (
			!title.includes("WIP") &&
			!title.includes("Work In Progress") &&
			!title.includes("work in progress") &&
			!title.includes(":construction:")
		) {
			await context.octokit.issues.update({
				...context.issue(),
				title: `:construction: ${context.payload.issue.title}`,
			});
		}
	}
}
