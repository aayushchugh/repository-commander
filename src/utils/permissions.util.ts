import type { Context } from "probot";

export async function hasWriteAccess(context: Context<"issue_comment.created">): Promise<boolean> {
	const { data: permissions } = await context.octokit.repos.getCollaboratorPermissionLevel({
		...context.repo(),
		username: context.payload.sender.login,
	});

	return ["admin", "write"].includes(permissions.permission);
}

export function isAuthor(context: Context<"issue_comment.created">): boolean {
	const issueAuthor = context.payload.issue.user.login;
	const commenter = context.payload.comment.user.login;
	return issueAuthor === commenter;
}
