import { Context } from "probot";

import { addLabel, removeLabel } from "../utils/label.util";
import { listIssueLabels } from "../utils/listLabels.util";

export async function addReadyForReviewLabel(context: Context) {
	addLabel([":mag: Ready for Review"], context);
}

export async function addApprovedLabel(context: Context) {
	const params = context.pullRequest();
	const issueLabels = await listIssueLabels(context);

	const reviews = await context.octokit.pulls.listReviews(params);
	const approvedLabel = issueLabels.data.filter(
		label => label.name === ":white_check_mark: Approved"
	);
	const changesRequestedLabel = issueLabels.data.filter(
		label => label.name === ":warning: Changes requested"
	);

	const approvedReviews = reviews.data.filter(
		review => review.state === "APPROVED"
	);

	const foundChangesRequestedReview = reviews.data.filter(
		review => review.state === "CHANGES_REQUESTED"
	);

	if (
		foundChangesRequestedReview.length === 0 &&
		changesRequestedLabel.length > 0
	) {
		removeLabel(":warning: Changes requested", context);
	}

	if (approvedReviews.length === 0 && approvedLabel.length > 0) {
		removeLabel(":white_check_mark: Approved", context);
	}

	if (approvedReviews.length > 0) {
		const issueLabels = await listIssueLabels(context);

		const foundReviewLabel = issueLabels.data.filter(
			label => label.name === ":mag: Ready for Review"
		);

		if (approvedLabel.length === 0) {
			addLabel([":white_check_mark: Approved"], context);
		}

		if (foundReviewLabel.length > 0) {
			removeLabel(":mag: Ready for Review", context);
		}
	}
}

export async function addMergedLabel(context: Context<"pull_request.closed">) {
	const { title } = context.payload.pull_request;

	if (context.payload.pull_request.merged) {
		//@ts-ignore
		const issueLabels = await listIssueLabels(context);

		const foundApproveLabel = issueLabels.data.filter(
			label => label.name === ":white_check_mark: Approved"
		);
		const foundWIPLabel = issueLabels.data.filter(
			label => label.name === ":construction: WIP"
		);

		addLabel([":sparkles: Merged:"], context);

		if (foundApproveLabel.length > 0) {
			removeLabel(":white_check_mark: Approved", context);
		}

		if (foundWIPLabel.length > 0) {
			removeLabel(":construction: WIP", context);
		}

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

export async function changesRequestLabel(context: Context) {
	const issueLabels = await listIssueLabels(context);

	const params = context.pullRequest();

	const reviews = await context.octokit.pulls.listReviews(params);

	const changesRequestedReviews = reviews.data.filter(
		review => review.state === "CHANGES_REQUESTED"
	);

	const foundChangedRequestedLabel = issueLabels.data.filter(
		label => label.name === ":warning: Changes requested"
	);

	const foundReadyForReviewLabel = issueLabels.data.filter(
		label => label.name === ":mag: Ready for Review"
	);

	const foundApprovedLabel = issueLabels.data.filter(
		label => label.name === ":white_check_mark: Approved"
	);

	if (
		changesRequestedReviews.length > 0 &&
		foundChangedRequestedLabel.length === 0
	) {
		addLabel([":warning: Changes requested"], context, "AA2626");
	}

	if (
		changesRequestedReviews.length > 0 &&
		foundReadyForReviewLabel.length > 0
	) {
		removeLabel(":mag: Ready for Review", context);
	}

	if (changesRequestedReviews.length > 0 && foundApprovedLabel.length > 0) {
		removeLabel(":white_check_mark: Approved", context);
	}
}

export async function addCloseLabel(context: Context<"pull_request.closed">) {
	try {
	} catch (err) {
		const issueLabels = await listIssueLabels(context);
		const foundReadyForReviewLabel = issueLabels.data.filter(
			label => label.name === ":mag: Ready for Review"
		);
		const foundApprovedLabel = issueLabels.data.filter(
			label => label.name === ":white_check_mark: Approved"
		);
		const foundChangesRequestedLabel = issueLabels.data.filter(
			label => label.name === ":warning: Changes requested"
		);

		if (foundReadyForReviewLabel.length > 0) {
			removeLabel(":mag: Ready for Review", context);
		}

		if (foundApprovedLabel.length > 0) {
			removeLabel(":white_check_mark: Approved", context);
		}

		if (foundChangesRequestedLabel.length > 0) {
			removeLabel(":warning: Changes requested", context);
		}

		addLabel([":x: closed"], context, "B60205");
	}
}
