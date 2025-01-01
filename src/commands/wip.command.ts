import type { Context } from "probot";
import { addLabel, removeLabel, listLabelsOnIssue } from "../utils/label.util";
import { getConfig } from "../utils/config.util";
import { hasWriteAccess, isAuthor } from "../utils/permissions.util";
import { createComment } from "../utils/comment.util";

export async function handleWIPCommand(context: Context<"issue_comment.created">) {
	const config = await getConfig(context);
	const canModify = (await hasWriteAccess(context)) || isAuthor(context);

	if (!canModify) {
		await createComment(
			context,
			"Sorry, only the author or users with write access can mark this as work in progress.",
		);
		return;
	}

	const { title } = context.payload.issue;
	const labelsFromIssues = await listLabelsOnIssue(context);

	const wipLabel = labelsFromIssues.data.find((label) => label.name === config.labels.wip);
	const foundReadyForReviewLabel = labelsFromIssues.data.find(
		(label) => label.name === config.labels.readyForReview,
	);

	if (wipLabel) {
		if (!foundReadyForReviewLabel && context.payload.issue.pull_request) {
			await addLabel(context, config.labels.readyForReview);
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

		await removeLabel(context, config.labels.wip);
	} else {
		if (foundReadyForReviewLabel) {
			await removeLabel(context, config.labels.readyForReview);
		}

		await addLabel(context, config.labels.wip, config.colors.gray);

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
