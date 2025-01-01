import type { Context } from "probot";
import { addLabel, removeLabel, listLabelsOnIssue } from "../utils/label.util";

export async function addReadyForReviewLabel(context: Context) {
	await addLabel(context, "Ready for Review");
}

export async function addApprovedLabel(context: Context) {
	const issueLabels = await listLabelsOnIssue(context);
	const reviews = await context.octokit.pulls.listReviews(context.pullRequest());

	const hasApprovedLabel = issueLabels.data.some((label) => label.name === "Approved");
	const hasChangesRequestedLabel = issueLabels.data.some(
		(label) => label.name === "Changes requested",
	);
	const hasReadyForReviewLabel = issueLabels.data.some(
		(label) => label.name === "Ready for Review",
	);

	const approvedReviews = reviews.data.filter((review) => review.state === "APPROVED");
	const changesRequestedReviews = reviews.data.filter(
		(review) => review.state === "CHANGES_REQUESTED",
	);

	if (changesRequestedReviews.length === 0 && hasChangesRequestedLabel) {
		await removeLabel(context, "Changes requested");
	}

	if (approvedReviews.length === 0 && hasApprovedLabel) {
		await removeLabel(context, "Approved");
	}

	if (approvedReviews.length > 0) {
		if (!hasApprovedLabel) {
			await addLabel(context, "Approved");
		}

		if (hasReadyForReviewLabel) {
			await removeLabel(context, "Ready for Review");
		}
	}
}

export async function changesRequestLabel(context: Context) {
	const issueLabels = await listLabelsOnIssue(context);
	const reviews = await context.octokit.pulls.listReviews(context.pullRequest());

	const changesRequestedReviews = reviews.data.filter(
		(review) => review.state === "CHANGES_REQUESTED",
	);

	if (changesRequestedReviews.length > 0) {
		const hasChangesRequestedLabel = issueLabels.data.some(
			(label) => label.name === "Changes requested",
		);
		const hasReadyForReviewLabel = issueLabels.data.some(
			(label) => label.name === "Ready for Review",
		);
		const hasApprovedLabel = issueLabels.data.some((label) => label.name === "Approved");

		if (!hasChangesRequestedLabel) {
			await addLabel(context, "Changes requested", "AA2626");
		}

		if (hasReadyForReviewLabel) {
			await removeLabel(context, "Ready for Review");
		}

		if (hasApprovedLabel) {
			await removeLabel(context, "Approved");
		}
	}
}

export async function addMergedLabel(context: Context<"pull_request.closed">) {
	if (context.payload.pull_request.merged) {
		const issueLabels = await listLabelsOnIssue(context);
		const labelsToRemove = ["Ready for Review", "Approved", "Changes requested"];

		for (const labelName of labelsToRemove) {
			if (issueLabels.data.some((label) => label.name === labelName)) {
				await removeLabel(context, labelName);
			}
		}

		await addLabel(context as Context, ":sparkles: Merged:");

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
	const issueLabels = await listLabelsOnIssue(context as Context);
	const hasClosedLabel = issueLabels.data.find((label) => label.name === "closed");

	if (hasClosedLabel) {
		await removeLabel(context as Context, "closed");
	}
}
