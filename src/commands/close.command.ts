import type { Context } from "probot";
import { createComment } from "../utils/comment.util";

export async function handleCloseCommand(context: Context<"issue_comment">) {
	await createComment(
		context,
		`Closing this issue as requested by @${context.payload.comment.user.login}`,
	);

	await context.octokit.issues.update({
		...context.issue(),
		state: "closed",
	});
}
