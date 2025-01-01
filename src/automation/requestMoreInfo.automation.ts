import type { Context } from "probot";
import { createComment } from "../utils/comment.util";
import { addLabel, removeLabel, listLabelsOnIssue } from "../utils/label.util";
import { getConfig } from "../utils/config.util";

export async function requestMoreInfo(context: Context<"issues.opened" | "issues.edited">) {
	const config = await getConfig(context);
	const { body, user } = context.payload.issue;

	if (!body || body.length < config.minBodyLength) {
		await addLabel(context, config.labels.needsMoreInfo, config.colors.orange);

		await createComment(
			context,
			`Hey @${user.login}! We need more information to help you better. Please provide more details about what you're trying to accomplish here.
			Please edit your issue to include more details.`,
		);
	}
}

export async function removeRequestMoreInfoLabel(context: Context<"issues.edited">) {
	const config = await getConfig(context);
	const { body, user } = context.payload.issue;
	const labels = await listLabelsOnIssue(context);

	const hasNeedsMoreInfoLabel = labels.data.find(
		(label) => label.name === config.labels.needsMoreInfo,
	);

	if (hasNeedsMoreInfoLabel && body && body.length >= config.minBodyLength) {
		await removeLabel(context, config.labels.needsMoreInfo);

		await createComment(
			context,
			`@${user.login} Thanks for adding more information! I've removed the needs more info label.`,
		);
	}
}
