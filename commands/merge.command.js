const mergeCommand = context => {
	const merge = context.pullRequest({
		commit_title: context.payload.issue.title,
		commit_body: context.payload.issue.body,
		merge_method: 'squash',
	});

	context.octokit.pulls.merge(merge);
};

module.exports = mergeCommand;
