const addLabelsBasedOnTitleAndBody = require('./automation/addLabelsBasedOnTitleAndBody.automation');
const approveCommand = require('./commands/approve.command');
const closeCommand = require('./commands/close.command');
const labelCommand = require('./commands/label.command');
const { createComment, deleteComment } = require('./helpers/comment.helper');
const getCommandAndArgs = require('./helpers/getCommandAndArgs.helper');

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
module.exports = app => {
	/* --------------------------------- ANCHOR issue opened --------------------------------- */
	app.on('issues.opened', addLabelsBasedOnTitleAndBody);

	/* --------------------------------- ANCHOR Issue commands --------------------------------- */
	app.on('issue_comment.created', context => {
		const { body } = context.payload.comment;
		const { command, args } = getCommandAndArgs(body);
		const commentingUser = context.payload.comment.user.login;

		switch (command) {
			case '/label':
				labelCommand(context, args);
				break;
			case '/close':
				closeCommand(context);
				break;
			case '/approve':
				approveCommand(context);
				break;

			default:
				if (command[0] === '/') {
					if (!context.isBot()) {
						createComment(
							context,
							`**${command}** command doesn't exist.
						     Available commands are:- 
						    - **/label** - Add labels to an issue or pull request.
							- **/close** - Close an issue or pull request.
						    `
						);
					}

					if (context.isBot()) {
						deleteComment(context);
					}
				}
				break;
		}
	});
};
