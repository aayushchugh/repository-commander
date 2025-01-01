import type { Context } from "probot";
import { createComment } from "../utils/comment.util";
import { hasWriteAccess, isAuthor } from "../utils/permissions.util";

export async function handleCloseCommand(context: Context<"issue_comment.created">) {
	const canClose = (await hasWriteAccess(context)) || isAuthor(context);

	if (!canClose) {
		await createComment(
			context,
			"Sorry, only the author or users with write access can close this.",
		);
		return;
	}

	await createComment(
		context,
		`Closing this as requested by @${context.payload.comment.user.login}`,
	);

	await context.octokit.issues.update({
		...context.issue(),
		state: "closed",
	});
}
