import type { Context } from "probot";

export async function listRepoLabels(context: Context) {
	const params = context.repo();

	const repoLabels = await context.octokit.issues.listLabelsForRepo(params);

	return repoLabels;
}

export async function listIssueLabels(context: Context) {
	const params = context.issue();

	const issueLabels = await context.octokit.issues.listLabelsOnIssue(params);

	return issueLabels;
}
