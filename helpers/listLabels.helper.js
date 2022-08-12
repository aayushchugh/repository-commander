exports.listRepoLabels = async context => {
	const repoLabels = await context.octokit.issues.listLabelsForRepo({
		owner: context.payload.repository.owner.login,
		repo: context.payload.repository.name,
	});

	return repoLabels;
};

exports.listIssueLabels = async context => {
	const params = context.issue();

	const issueLabels = await context.octokit.issues.listLabelsOnIssue(params);

	return issueLabels;
};
