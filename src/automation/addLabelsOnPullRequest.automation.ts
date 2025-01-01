import type { Context } from "probot";
import { addLabel, removeLabel, listLabelsOnIssue } from "../utils/label.util";
import { Labels, ReviewStates } from "../constants/enums";

export async function addReadyForReviewLabel(context: Context) {
	await addLabel(context, Labels.READY_FOR_REVIEW);
}

export async function addApprovedLabel(context: Context) {
	const issueLabels = await listLabelsOnIssue(context);
	const reviews = await context.octokit.pulls.listReviews(context.pullRequest());

	const hasApprovedLabel = issueLabels.data.some((label) => label.name === Labels.APPROVED);
	const hasChangesRequestedLabel = issueLabels.data.some(
		(label) => label.name === Labels.CHANGES_REQUESTED,
	);
	const hasReadyForReviewLabel = issueLabels.data.some(
		(label) => label.name === Labels.READY_FOR_REVIEW,
	);

	const approvedReviews = reviews.data.filter((review) => review.state === ReviewStates.APPROVED);
	const changesRequestedReviews = reviews.data.filter(
		(review) => review.state === ReviewStates.CHANGES_REQUESTED,
	);

	if (changesRequestedReviews.length === 0 && hasChangesRequestedLabel) {
		await removeLabel(context, Labels.CHANGES_REQUESTED);
	}

	if (approvedReviews.length === 0 && hasApprovedLabel) {
		await removeLabel(context, Labels.APPROVED);
	}

	if (approvedReviews.length > 0) {
		if (!hasApprovedLabel) {
			await addLabel(context, Labels.APPROVED);
		}

		if (hasReadyForReviewLabel) {
			await removeLabel(context, Labels.READY_FOR_REVIEW);
		}
	}
}

export async function changesRequestLabel(context: Context) {
	const issueLabels = await listLabelsOnIssue(context);
	const reviews = await context.octokit.pulls.listReviews(context.pullRequest());

	const changesRequestedReviews = reviews.data.filter(
		(review) => review.state === ReviewStates.CHANGES_REQUESTED,
	);

	if (changesRequestedReviews.length > 0) {
		const hasChangesRequestedLabel = issueLabels.data.some(
			(label) => label.name === Labels.CHANGES_REQUESTED,
		);
		const hasReadyForReviewLabel = issueLabels.data.some(
			(label) => label.name === Labels.READY_FOR_REVIEW,
		);
		const hasApprovedLabel = issueLabels.data.some((label) => label.name === Labels.APPROVED);

		if (!hasChangesRequestedLabel) {
			await addLabel(context, Labels.CHANGES_REQUESTED);
		}

		if (hasReadyForReviewLabel) {
			await removeLabel(context, Labels.READY_FOR_REVIEW);
		}

		if (hasApprovedLabel) {
			await removeLabel(context, Labels.APPROVED);
		}
	}
}

export async function addMergedLabel(context: Context<"pull_request.closed">) {
	if (context.payload.pull_request.merged) {
		const issueLabels = await listLabelsOnIssue(context);
		const labelsToRemove = [Labels.READY_FOR_REVIEW, Labels.APPROVED, Labels.CHANGES_REQUESTED];

		for (const labelName of labelsToRemove) {
			if (issueLabels.data.some((label) => label.name === labelName)) {
				await removeLabel(context, labelName);
			}
		}

		await addLabel(context, Labels.MERGED);

		const title = context.payload.pull_request.title;
		if (title.includes("WIP") || title.includes("Work In Progress")) {
			await context.octokit.pulls.update({
				...context.pullRequest(),
				title: title.replace(/WIP|Work In Progress/gi, "").trim(),
			});
		}
	}
}

export async function removeClosedLabel(context: Context<"pull_request.reopened">) {
	const issueLabels = await listLabelsOnIssue(context);
	const hasClosedLabel = issueLabels.data.find((label) => label.name === Labels.CLOSED);

	if (hasClosedLabel) {
		await removeLabel(context, Labels.CLOSED);
	}
}
