const approveCommand = context => {
	const review = context.pullRequest({
		event: 'APPROVE',
	});

	context.octokit.pulls.createReview(review);
};

module.exports = approveCommand;
