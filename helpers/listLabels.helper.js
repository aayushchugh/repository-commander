exports.listRepoLabels = async context => {
	const repoLabels = await context.octokit.issues.listLabelsForRepo({
		owner: context.payload.repository.owner.login,
		repo: context.payload.repository.name,
	});

	return repoLabels;
};

exports.listIssueLabels = async context => {
	const issueLabels = await context.octokit.issues.listLabelsOnIssue({
		owner: context.payload.repository.owner.login,
		repo: context.payload.repository.name,
		issue_number: context.payload.issue.number,
	});

	return issueLabels;
};
