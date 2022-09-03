import type { Context } from "probot";

/**
 * Create a comment on an issue.
 *
 * @param {Context} context Probot context
 * @param {string} comment The comment to create
 */
export function createComment(context: Context, comment: string) {
	const params = context.issue({
		body: comment,
	});

	context.octokit.issues.createComment(params);
}

/**
 * Create a comment on an issue.
 *
 * @param {Context} context Probot context
 */
export function deleteComment(context: Context<"issue_comment.deleted">) {
	const params = context.issue();

	context.octokit.issues.deleteComment({
		...params,
		comment_id: context.payload.comment.id,
	});
}
