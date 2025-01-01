import type { Context } from "probot";
import { createComment } from "../utils/comment.util";
import { addLabel, removeLabel, listLabelsOnIssue } from "../utils/label.util";
import { Labels, Colors } from "../constants/enums";

export async function requestMoreInfo(context: Context<"issues.opened" | "issues.edited">) {
	const { body, user } = context.payload.issue;

	if (!body || body.length < 20) {
		await createComment(
			context,
			`Hey There! @${user.login} You didn't give us a whole lot of information about this issue. We would love if you could provide more details about what you're trying to accomplish here.
			Please edit your issue to include more details.`,
		);

		await addLabel(context, Labels.NEEDS_MORE_INFO, Colors.ORANGE);
	}
}

export async function removeRequestMoreInfoLabel(context: Context<"issues.edited">) {
	const { body, user } = context.payload.issue;
	const labels = await listLabelsOnIssue(context);

	const hasNeedsMoreInfoLabel = labels.data.find(
		(label) => label.name === Labels.NEEDS_MORE_INFO,
	);

	if (hasNeedsMoreInfoLabel && body && body.length > 20) {
		await createComment(
			context,
			`@${user.login} Thanks for adding more information to this issue! I've removed the "needs more info" label.`,
		);

		await removeLabel(context, Labels.NEEDS_MORE_INFO);
	}
}
