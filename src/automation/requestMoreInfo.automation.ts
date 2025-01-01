import type { Context } from "probot";
import { createComment } from "../utils/comment.util";
import { addLabel, removeLabel, listLabelsOnIssue } from "../utils/label.util";
import { getConfig } from "../utils/config.util";

export async function requestMoreInfo(context: Context<"issues.opened" | "issues.edited">) {
	const config = await getConfig(context);
	const { body, user } = context.payload.issue;

	if (!body || body.length < config.minBodyLength) {
		await addLabel(context, config.labels.needsMoreInfo, config.colors.orange);

		const message = config.messages.requestMoreInfo
			.replace("{user}", user.login)
			.replace("{type}", context.payload.issue.pull_request ? "pull request" : "issue");

		await createComment(context, message);
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

		const message = config.messages.moreInfoAdded.replace("{user}", user.login);
		await createComment(context, message);
	}
}
