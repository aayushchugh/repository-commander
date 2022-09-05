import type { Context } from "probot";
import { createComment } from "../utils/comment.util";
import { addLabel, removeLabel } from "../utils/label.util";
import { listIssueLabels } from "../utils/listLabels.util";

export async function requestMoreInfo(context: Context<"issues.opened">) {
	const { body } = context.payload.issue;

	if (!body || body.length < 20) {
		// @ts-ignore
		createComment(
			context,
			`Hey There! @${context.payload.issue.user.login} You didn't give us a whole lot of information about this issue. We would love if you could provide more details about what you're trying to accomplish here.
            Please edit your issue to include more details.`,
		);

		addLabel([":eyes: needs more info"], context, "B60205");
	}
}

export async function removeRequestMoreInfoLabel(context: Context<"issues.edited">) {
	const { body } = context.payload.issue;
	// @ts-ignore
	const issueLabels = await listIssueLabels(context);
	const foundNeedsMoreInfoLabel = issueLabels.data.find(
		(label: any) => label.name === ":eyes: needs more info",
	);

	if (foundNeedsMoreInfoLabel && body && body.length > 20) {
		// @ts-ignore
		createComment(
			context,
			`@${context.payload.issue.user.login} Thanks for adding more information to this issue! I've removed the ":eyes: needs more info" label.`,
		);

		removeLabel(":eyes: needs more info", context);
	}
}
