const labelCommand = require('./commands/label.command');
const { createComment } = require('./helpers/comment.helper');
const getCommandAndArgs = require('./helpers/getCommandAndArgs.helper');

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
module.exports = app => {
	/* --------------------------------- ANCHOR Issue commands --------------------------------- */
	app.on('issue_comment.created', context => {
		const { body } = context.payload.comment;
		const { command, args } = getCommandAndArgs(body);
		const commentingUser = context.payload.comment.user.login;

		switch (command) {
			case '/label':
				labelCommand(context, args);
				break;

			default:
				if (command[0] === '/') {
					if (commentingUser !== 'shriproperty[bot]') {
						createComment(
							context,
							`**${command}** command doesn't exist.
						     Available commands are:- 
						    - **/label** - Add labels to an issue.
						    `
						);
					}
				}
				break;
		}
	});
};
