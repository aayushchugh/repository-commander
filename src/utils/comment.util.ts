import type { Context } from "probot";

class Comment {
	private context:
		| Context<"issue_comment.created">
		| Context<"issues.edited">
		| Context<"issues.opened">;

	private params: ReturnType<
		| Context<"issue_comment.created">["issue"]
		| Context<"issues.edited">["issue"]
		| Context<"issues.opened">["issue"]
	>;

	/**
	 * @param context Probot context
	 */
	constructor(
		context:
			| Context<"issue_comment.created">
			| Context<"issues.edited">
			| Context<"issues.opened">,
	) {
		this.context = context;
		this.params = context.issue();
	}

	/**
	 * Creates a comment on current issue.
	 * @param body The body of the comment
	 */
	public create(body: string): void {
		this.context.octokit.issues.createComment({
			...this.params,
			body,
		});
	}

	/**
	 * Delete current comment.
	 */
	public delete(): void {
		this.context.octokit.issues.deleteComment({
			...this.params,
			comment_id: (this.context as Context<"issue_comment.created">).payload.comment.id,
		});
	}
}

export default Comment;
