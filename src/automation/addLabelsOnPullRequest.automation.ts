import type { Context } from "probot";
import { addLabel, removeLabel, listLabelsOnIssue } from "../utils/label.util";
import { getConfig } from "../utils/config.util";

export async function addReadyForReviewLabel(context: Context) {
	const config = await getConfig(context);
	await addLabel(context, config.labels.readyForReview);
}

export async function addApprovedLabel(context: Context) {
	const config = await getConfig(context);
	const issueLabels = await listLabelsOnIssue(context);
	const reviews = await context.octokit.pulls.listReviews(context.pullRequest());

	const hasApprovedLabel = issueLabels.data.some(
		(label) => label.name === config.labels.approved,
	);
	const hasChangesRequestedLabel = issueLabels.data.some(
		(label) => label.name === config.labels.changesRequested,
	);
	const hasReadyForReviewLabel = issueLabels.data.some(
		(label) => label.name === config.labels.readyForReview,
	);

	const approvedReviews = reviews.data.filter((review) => review.state === "APPROVED");
	const changesRequestedReviews = reviews.data.filter(
		(review) => review.state === "CHANGES_REQUESTED",
	);

	if (changesRequestedReviews.length === 0 && hasChangesRequestedLabel) {
		await removeLabel(context, config.labels.changesRequested);
	}

	if (approvedReviews.length === 0 && hasApprovedLabel) {
		await removeLabel(context, config.labels.approved);
	}

	if (approvedReviews.length > 0) {
		if (!hasApprovedLabel) {
			await addLabel(context, config.labels.approved);
		}

		if (hasReadyForReviewLabel) {
			await removeLabel(context, config.labels.readyForReview);
		}
	}
}

export async function changesRequestLabel(context: Context) {
	const issueLabels = await listLabelsOnIssue(context);
	const reviews = await context.octokit.pulls.listReviews(context.pullRequest());
	const config = await getConfig(context);

	const changesRequestedReviews = reviews.data.filter(
		(review) => review.state === "CHANGES_REQUESTED",
	);

	if (changesRequestedReviews.length > 0) {
		const hasChangesRequestedLabel = issueLabels.data.some(
			(label) => label.name === config.labels.changesRequested,
		);
		const hasReadyForReviewLabel = issueLabels.data.some(
			(label) => label.name === config.labels.readyForReview,
		);
		const hasApprovedLabel = issueLabels.data.some(
			(label) => label.name === config.labels.approved,
		);

		if (!hasChangesRequestedLabel) {
			await addLabel(context, config.labels.changesRequested);
		}

		if (hasReadyForReviewLabel) {
			await removeLabel(context, config.labels.readyForReview);
		}

		if (hasApprovedLabel) {
			await removeLabel(context, config.labels.approved);
		}
	}
}

export async function addMergedLabel(context: Context<"pull_request.closed">) {
	if (context.payload.pull_request.merged) {
		const config = await getConfig(context);
		const issueLabels = await listLabelsOnIssue(context);
		const labelsToRemove = [
			config.labels.readyForReview,
			config.labels.approved,
			config.labels.changesRequested,
		];

		for (const labelName of labelsToRemove) {
			if (issueLabels.data.some((label) => label.name === labelName)) {
				await removeLabel(context, labelName);
			}
		}

		await addLabel(context, config.labels.merged);

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
	const config = await getConfig(context);
	const issueLabels = await listLabelsOnIssue(context);
	const hasClosedLabel = issueLabels.data.find((label) => label.name === config.labels.closed);

	if (hasClosedLabel) {
		await removeLabel(context, config.labels.closed);
	}
}
