import type { Context } from "probot";
import { createComment } from "../utils/comment.util";
import { addLabel } from "../utils/label.util";
import { Colors } from "../constants/enums";
import { hasWriteAccess } from "../utils/permissions.util";
import { getConfig } from "../utils/config.util";

export async function handleRequestMoreInfoCommand(
	context: Context<"issue_comment.created">,
	args: string[],
): Promise<void> {
	const config = await getConfig(context);
	const canRequest = await hasWriteAccess(context);

	if (!canRequest) {
		await createComment(
			context,
			"Sorry, only users with write access can request more information.",
		);
		return;
	}

	const customMessage = args.length > 0 ? args.join(" ") : null;
	const { user } = context.payload.issue;

	const message = customMessage
		? `Hey @${user.login}! ${customMessage}`
		: `Hey @${user.login}! We need more information to help you better. Please provide:
		- What you're trying to accomplish
		- What you've tried so far
		- Any error messages or unexpected behavior
		
		Please edit your ${context.payload.issue.pull_request ? "pull request" : "issue"} to include these details.`;

	await createComment(context, message);
	await addLabel(context, config.labels.needsMoreInfo, config.colors.orange);
}
