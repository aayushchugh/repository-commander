import { Probot } from "probot";
import type { Context } from "probot";

import {
	addReadyForReviewLabel,
	addApprovedLabel,
	addMergedLabel,
	changesRequestLabel,
	addCloseLabel,
} from "./automation/addLabelsOnPullRequest.automation";
import addLabelToIssueOnClose from "./automation/addLabelToIssueOnClose.automation";
import approveCommand from "./commands/approve.command";
import closeCommand from "./commands/close.command";
import labelCommand from "./commands/label.command";
import mergeCommand from "./commands/merge.command";
import WIPCommand from "./commands/wip.command";
import { createComment, deleteComment } from "./utils/comment.util";
import getCommandAndArgs from "./utils/getCommandAndArgs.util";

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
export = (app: Probot) => {
	/* --------------------------------- ANCHOR Automation --------------------------------- */
	app.on("pull_request.opened", addReadyForReviewLabel);

	app.on("pull_request_review.submitted", addApprovedLabel);
	app.on("pull_request_review.submitted", changesRequestLabel);

	app.on("pull_request.closed", addMergedLabel);
	app.on("pull_request.closed", addCloseLabel);

	app.on("issues.closed", addLabelToIssueOnClose);

	/* --------------------------------- ANCHOR Issue commands --------------------------------- */
	app.on("issue_comment.created", async (context: Context<"issue_comment.created">) => {
		const { body } = context.payload.comment;
		const { command, args } = getCommandAndArgs(body);
		const commentId = context.payload.comment.id;

		if (command[0] === "/" && !context.isBot) {
			const params = context.issue();

			// context.octokit.reactions.createForIssueComment(params);
			context.octokit.reactions.createForIssueComment({
				owner: params.owner,
				repo: params.repo,
				comment_id: commentId,
				content: "rocket",
			});
		}

		switch (command) {
			case "/label":
				labelCommand(context, args);
				break;
			case "/close":
				closeCommand(context);
				break;
			case "/approve":
				approveCommand(context);
				break;
			case "/merge":
				mergeCommand(context);
				break;
			case "/WIP":
				WIPCommand(context);
				break;

			default:
				if (command[0] === "/") {
					if (!context.isBot) {
						const params = context.issue();

						context.octokit.reactions.createForIssueComment({
							owner: params.owner,
							repo: params.repo,
							comment_id: commentId,
							content: "-1",
						});

						createComment(
							context,
							`**${command}** command doesn't exist.
						     ${availableCommandsMessage}
						    `,
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
