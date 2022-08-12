const closeCommand = context => {
	const closeIssue = context.issue({
		state: 'closed',
	});

	context.octokit.issues.update(closeIssue);
};

module.exports = closeCommand;
