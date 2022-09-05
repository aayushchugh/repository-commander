import type { Context } from "probot";

export async function listRepoLabels(context: Context) {
	const params = context.repo();

	return await context.octokit.issues.listLabelsForRepo(params);
}

export async function listIssueLabels(context: Context) {
	const params = context.issue();

	return await context.octokit.issues.listLabelsOnIssue(params);
}
