/**
 * Create a comment on an issue.
 *
 * @param {*} context Probot context
 * @param {*} comment The comment to create
 */
exports.createComment = (context, comment) => {
	const params = context.issue({
		body: comment,
	});

	context.octokit.issues.createComment(params);
};

/**
 * Create a comment on an issue.
 *
 * @param {*} context Probot context
 * @param {*} commentId Id of comment to delete
 */
exports.deleteComment = context => {
	context.octokit.issues.deleteComment({
		owner: context.payload.organization.login,
		repo: context.payload.repository.name,
		comment_id: context.payload.comment.id,
	});
};
