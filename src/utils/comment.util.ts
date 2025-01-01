import type { Context } from "probot";

export async function createComment(context: Context, body: string) {
	return await context.octokit.issues.createComment({
		...context.issue(),
		body,
	});
}

export async function deleteComment(context: Context<"issue_comment">) {
	return await context.octokit.issues.deleteComment({
		...context.issue(),
		comment_id: context.payload.comment.id,
	});
}
