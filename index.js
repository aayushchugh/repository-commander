const addLabelsBasedOnTitleAndBody = require('./automation/addLabelsBasedOnTitleAndBody.automation');
const {
	addReadyForReviewLabel,
	addApprovedLabel,
	addMergedLabel,
} = require('./automation/addLabelsOnPullRequest.automation');
const addLabelToIssueOnClose = require('./automation/addLabelToIssueOnClose.automation');
const approveCommand = require('./commands/approve.command');
const closeCommand = require('./commands/close.command');
const labelCommand = require('./commands/label.command');
const mergeCommand = require('./commands/merge.command');
const WIPCommand = require('./commands/wip.command');
const { createComment, deleteComment } = require('./helpers/comment.helper');
const getCommandAndArgs = require('./helpers/getCommandAndArgs.helper');
const { addLabel } = require('./helpers/label.helper');

const availableCommandsMessage = `Available commands are:- 
						    - **/label** - Add labels to an issue or pull request.
							- **/close** - Close an issue or pull request.
							- **/approve** - Approve a pull request.
							- **/merge** - Merge a pull request.
							- **/WIP** - Add the WIP label.`;

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
module.exports = app => {
	/* --------------------------------- ANCHOR Automation --------------------------------- */
	app.on('issues.opened', addLabelsBasedOnTitleAndBody);
	app.on('issues.edited', addLabelsBasedOnTitleAndBody);
	// app.on('pull_request.opened', addLabelsBasedOnTitleAndBody);
	app.on('pull_request.edited', addLabelsBasedOnTitleAndBody);

	app.on('pull_request.opened', addReadyForReviewLabel);
	app.on('pull_request_review', addApprovedLabel);
	app.on('pull_request.closed', addMergedLabel);

	app.on('issues.closed', addLabelToIssueOnClose);

	/* --------------------------------- ANCHOR Issue commands --------------------------------- */
	app.on('issue_comment.created', async context => {
		const { body } = context.payload.comment;
		const { command, args } = getCommandAndArgs(body);

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
			case '/merge':
				mergeCommand(context);
				break;
			case '/WIP':
				WIPCommand(context);
				break;

			default:
				if (command[0] === '/') {
					if (!context.isBot) {
						createComment(
							context,
							`**${command}** command doesn't exist.
						     ${availableCommandsMessage}
						    `
						);
					}

					if (context.isBot) {
						deleteComment(context);
					}
				}
				break;
		}
	});
};
