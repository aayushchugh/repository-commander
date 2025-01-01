import type { Context } from "probot";
import { addLabel, removeLabel, listLabelsOnIssue } from "../utils/label.util";
import { Labels, Colors } from "../constants/enums";

export async function handleWIPCommand(context: Context<"issue_comment.created">) {
	const { title } = context.payload.issue;
	const labelsFromIssues = await listLabelsOnIssue(context);

	const wipLabel = labelsFromIssues.data.find((label) => label.name === Labels.WIP);
	const foundReadyForReviewLabel = labelsFromIssues.data.find(
		(label) => label.name === Labels.READY_FOR_REVIEW,
	);

	if (wipLabel) {
		if (!foundReadyForReviewLabel && context.payload.issue.pull_request) {
			await addLabel(context, Labels.READY_FOR_REVIEW);
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

		await removeLabel(context, Labels.WIP);
	} else {
		if (foundReadyForReviewLabel) {
			await removeLabel(context, Labels.READY_FOR_REVIEW);
		}

		await addLabel(context, Labels.WIP, Colors.GRAY);

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
