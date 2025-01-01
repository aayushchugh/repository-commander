import type { Context } from "probot";
import { createComment } from "../utils/comment.util";
import { addLabel } from "../utils/label.util";
import { Labels, Colors } from "../constants/enums";
import { hasWriteAccess } from "../utils/permissions.util";

export async function handleRequestMoreInfoCommand(
	context: Context<"issue_comment.created">,
	args: string[],
): Promise<void> {
	const canRequest = await hasWriteAccess(context);
	if (!canRequest) {
		await createComment(
			context,
			"Sorry, only users with write access can request more information.",
		);
		return;
	}

	const { user } = context.payload.issue;

	const message = `Hey There! @${user.login} You didn't give us a whole lot of information about this issue. We would love if you could provide more details about what you're trying to accomplish here.
			Please edit your ${context.payload.issue.pull_request ? "pull request" : "issue"} to include more details.`;

	await createComment(context, message);
	await addLabel(context, Labels.NEEDS_MORE_INFO, Colors.ORANGE);
}
