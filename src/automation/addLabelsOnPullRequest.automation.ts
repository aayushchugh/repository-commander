import { Context } from "probot";

import Label from "../utils/label.util";

export async function addReadyForReviewLabel(context: Context<"pull_request.opened">) {
	const label = new Label(context);

	label.add(":mag: Ready for Review");
}

export async function addApprovedLabel(context: Context<"pull_request_review.submitted">) {
	const label = new Label(context);
	const params = context.pullRequest();
	const issueLabels = await label.listIssueLabels();

	const reviews = await context.octokit.pulls.listReviews(params);
	const approvedLabel = issueLabels.data.filter(
		(label) => label.name === ":white_check_mark: Approved",
	);
	const changesRequestedLabel = issueLabels.data.filter(
		(label) => label.name === ":warning: Changes requested",
	);

	const approvedReviews = reviews.data.filter((review) => review.state === "APPROVED");

	const foundChangesRequestedReview = reviews.data.filter(
		(review) => review.state === "CHANGES_REQUESTED",
	);

	if (foundChangesRequestedReview.length === 0 && changesRequestedLabel.length > 0) {
		// @ts-ignore
		label.remove(":warning: Changes requested");
	}

	if (approvedReviews.length === 0 && approvedLabel.length > 0) {
		label.remove(":white_check_mark: Approved");
	}

	if (approvedReviews.length > 0) {
		const issueLabels = await label.listIssueLabels();

		const foundReviewLabel = issueLabels.data.filter(
			(label) => label.name === ":mag: Ready for Review",
		);

		if (approvedLabel.length === 0) {
			label.add(":white_check_mark: Approved");
		}

		if (foundReviewLabel.length > 0) {
			label.remove(":mag: Ready for Review");
		}
	}
}

export async function addMergedLabel(context: Context<"pull_request.closed">) {
	const { title } = context.payload.pull_request;
	const label = new Label(context);

	if (context.payload.pull_request.merged) {
		const issueLabels = await label.listIssueLabels();

		const foundReadyForReviewLabel = issueLabels.data.filter(
			(label) => label.name === ":mag: Ready for Review",
		);
		const foundApproveLabel = issueLabels.data.filter(
			(label) => label.name === ":white_check_mark: Approved",
		);
		const foundWIPLabel = issueLabels.data.filter(
			(label) => label.name === ":construction: WIP",
		);

		if (foundReadyForReviewLabel.length > 0) {
			label.remove(":mag: Ready for Review");
		}

		if (foundApproveLabel.length > 0) {
			label.remove(":white_check_mark: Approved");
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
		(label) => label.name === ":warning: Changes requested",
	);

	const foundReadyForReviewLabel = issueLabels.data.filter(
		(label) => label.name === ":mag: Ready for Review",
	);

	const foundApprovedLabel = issueLabels.data.filter(
		(label) => label.name === ":white_check_mark: Approved",
	);

	if (changesRequestedReviews.length > 0 && foundChangedRequestedLabel.length === 0) {
		label.add(":warning: Changes requested", "AA2626");
	}

	if (changesRequestedReviews.length > 0 && foundReadyForReviewLabel.length > 0) {
		label.remove(":mag: Ready for Review");
	}

	if (changesRequestedReviews.length > 0 && foundApprovedLabel.length > 0) {
		label.remove(":white_check_mark: Approved");
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
			(label) => label.name === ":mag: Ready for Review",
		);
		const foundApprovedLabel = issueLabels.data.filter(
			(label) => label.name === ":white_check_mark: Approved",
		);
		const foundChangesRequestedLabel = issueLabels.data.filter(
			(label) => label.name === ":warning: Changes requested",
		);

		if (foundReadyForReviewLabel.length > 0) {
			label.remove(":mag: Ready for Review");
		}

		if (foundApprovedLabel.length > 0) {
			label.remove(":white_check_mark: Approved");
		}

		if (foundChangesRequestedLabel.length > 0) {
			label.remove(":warning: Changes requested");
		}

		label.add(":x: closed", "B60205");
	}
}

export async function removeClosedLabel(context: Context<"pull_request.reopened">) {
	const label = new Label(context);

	const issueLabels = await label.listIssueLabels();
	const foundClosedLabel = issueLabels.data.find((label) => label.name === ":x: closed");

	if (foundClosedLabel) {
		label.remove(":x: closed");
	}
}
