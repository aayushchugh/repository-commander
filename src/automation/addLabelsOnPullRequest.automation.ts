import { Context } from "probot";

import Label from "../utils/label.util";

export async function addReadyForReviewLabel(context: Context<"pull_request.opened">) {
	const label = new Label(context);

	label.add("Ready for Review");
}

export async function addApprovedLabel(context: Context<"pull_request_review.submitted">) {
	const label = new Label(context);
	const params = context.pullRequest();
	const issueLabels = await label.listIssueLabels();

	const reviews = await context.octokit.pulls.listReviews(params);
	const approvedLabel = issueLabels.data.filter((label) => label.name === "Approved");
	const changesRequestedLabel = issueLabels.data.filter(
		(label) => label.name === "Changes requested",
	);

	const approvedReviews = reviews.data.filter((review) => review.state === "APPROVED");

	const foundChangesRequestedReview = reviews.data.filter(
		(review) => review.state === "CHANGES_REQUESTED",
	);

	if (foundChangesRequestedReview.length === 0 && changesRequestedLabel.length > 0) {
		// @ts-ignore
		label.remove("Changes requested");
	}

	if (approvedReviews.length === 0 && approvedLabel.length > 0) {
		label.remove("Approved");
	}

	if (approvedReviews.length > 0) {
		const issueLabels = await label.listIssueLabels();

		const foundReviewLabel = issueLabels.data.filter(
			(label) => label.name === "Ready for Review",
		);

		if (approvedLabel.length === 0) {
			label.add("Approved");
		}

		if (foundReviewLabel.length > 0) {
			label.remove("Ready for Review");
		}
	}
}

export async function addMergedLabel(context: Context<"pull_request.closed">) {
	const { title } = context.payload.pull_request;
	const label = new Label(context);

	if (context.payload.pull_request.merged) {
		const issueLabels = await label.listIssueLabels();

		const foundReadyForReviewLabel = issueLabels.data.filter(
			(label) => label.name === "Ready for Review",
		);
		const foundApproveLabel = issueLabels.data.filter((label) => label.name === "Approved");
		const foundWIPLabel = issueLabels.data.filter(
			(label) => label.name === ":construction: WIP",
		);

		if (foundReadyForReviewLabel.length > 0) {
			label.remove("Ready for Review");
		}

		if (foundApproveLabel.length > 0) {
			label.remove("Approved");
		}

		if (foundWIPLabel.length > 0) {
			label.remove(":construction: WIP");
		}

		label.add(":sparkles: Merged:");

		if (
			title.includes("WIP") ||
			title.includes("Work In Progress") ||
			title.includes("work in progress") ||
			title.includes(":construction:")
		) {
			const params = context.pullRequest({
				title: `${title.replace(":construction:", "")}`,
			});

			context.octokit.pulls.update(params);
		}
	}
}

export async function changesRequestLabel(context: Context<"pull_request_review.submitted">) {
	const label = new Label(context);
	const issueLabels = await label.listIssueLabels();

	const params = context.pullRequest();

	const reviews = await context.octokit.pulls.listReviews(params);

	const changesRequestedReviews = reviews.data.filter(
		(review) => review.state === "CHANGES_REQUESTED",
	);

	const foundChangedRequestedLabel = issueLabels.data.filter(
		(label) => label.name === "Changes requested",
	);

	const foundReadyForReviewLabel = issueLabels.data.filter(
		(label) => label.name === "Ready for Review",
	);

	const foundApprovedLabel = issueLabels.data.filter((label) => label.name === "Approved");

	if (changesRequestedReviews.length > 0 && foundChangedRequestedLabel.length === 0) {
		label.add("Changes requested", "AA2626");
	}

	if (changesRequestedReviews.length > 0 && foundReadyForReviewLabel.length > 0) {
		label.remove("Ready for Review");
	}

	if (changesRequestedReviews.length > 0 && foundApprovedLabel.length > 0) {
		label.remove("Approved");
	}
}

export async function addCloseLabel(context: Context<"pull_request.closed">) {
	try {
		const params = context.pullRequest();
		await context.octokit.pulls.checkIfMerged(params);
	} catch (err) {
		const label = new Label(context);

		const issueLabels = await label.listIssueLabels();
		const foundReadyForReviewLabel = issueLabels.data.filter(
			(label) => label.name === "Ready for Review",
		);
		const foundApprovedLabel = issueLabels.data.filter((label) => label.name === "Approved");
		const foundChangesRequestedLabel = issueLabels.data.filter(
			(label) => label.name === "Changes requested",
		);

		if (foundReadyForReviewLabel.length > 0) {
			label.remove("Ready for Review");
		}

		if (foundApprovedLabel.length > 0) {
			label.remove("Approved");
		}

		if (foundChangesRequestedLabel.length > 0) {
			label.remove("Changes requested");
		}

		label.add("closed", "B60205");
	}
}

export async function removeClosedLabel(context: Context<"pull_request.reopened">) {
	const label = new Label(context);

	const issueLabels = await label.listIssueLabels();
	const foundClosedLabel = issueLabels.data.find((label) => label.name === "closed");

	if (foundClosedLabel) {
		label.remove("closed");
	}
}
