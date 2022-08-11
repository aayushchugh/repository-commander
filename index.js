const randomColor = require('randomcolor');

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
module.exports = app => {
	// Your code here
	app.log.info('Yay, the app was loaded!');

	app.on('issues.opened', async context => {
		const issueComment = context.issue({
			body: 'Thanks for opening this issue!',
		});
		return context.octokit.issues.createComment(issueComment);
	});

	app.on('issue_comment.created', async context => {
		// get comment body
		const { body } = context.payload.comment;

		const split = body.split(' ');
		const command = split[0];
		const args = split.slice(1);

		if (command === '/label') {
			const repoLabels = await context.octokit.issues.listLabelsForRepo({
				owner: context.payload.repository.owner.login,
				repo: context.payload.repository.name,
			});

			args.forEach(label => {
				const foundLabel = repoLabels.data.find(
					repoLabel => repoLabel.name === label
				);

				if (!foundLabel) {
					context.octokit.issues.createLabel({
						name: label,
						owner: context.payload.repository.owner.login,
						repo: context.payload.repository.name,
						color: randomColor().split('#')[1],
					});
				}
			});

			const newLabels = context.issue({
				labels: args,
			});

			context.octokit.issues.addLabels(newLabels);
		}

		// add label to issue
	});

	// For more information on building apps:
	// https://probot.github.io/docs/

	// To get your app running against GitHub, see:
	// https://probot.github.io/docs/development/
};
