import { Probot } from "probot";
import type { Context } from "probot";
import { handleWIPCommand } from "./commands/wip.command";
import { handleApproveCommand } from "./commands/approve.command";
import { handleCloseCommand } from "./commands/close.command";
import { handleIssueClose } from "./automation/addLabelToIssueOnClose.automation";
import {
	requestMoreInfo,
	removeRequestMoreInfoLabel,
} from "./automation/requestMoreInfo.automation";
import { createComment, deleteComment } from "./utils/comment.util";
import { getCommandAndArgs } from "./utils/getCommandAndArgs.util";
import { handleLabelCommand } from "./commands/label.command";
import { handleMergeCommand } from "./commands/merge.command";
import {
	addReadyForReviewLabel,
	addApprovedLabel,
	changesRequestLabel,
	addMergedLabel,
	removeClosedLabel,
} from "./automation/addLabelsOnPullRequest.automation";
import { Commands } from "./constants/enums";
import { handleRequestMoreInfoCommand } from "./commands/requestMoreInfo.command";

const availableCommandsMessage = `Available commands are:- 
    - **/label** - Add labels to an issue or pull request.
    - **/close** - Close an issue or pull request.
    - **/approve** - Approve a pull request.
    - **/merge** - Merge a pull request.
    - **/WIP** - Add the WIP label.
    - **/request-info** - Request more information from the author.`;

export = (app: Probot) => {
	app.on("pull_request.opened", addReadyForReviewLabel);
	app.on("pull_request_review.submitted", addApprovedLabel);
	app.on("pull_request_review.submitted", changesRequestLabel);
	app.on("pull_request.closed", addMergedLabel);
	app.on("pull_request.reopened", removeClosedLabel);
	app.on("issues.opened", requestMoreInfo);
	app.on("issues.edited", removeRequestMoreInfoLabel);
	app.on("issues.closed", handleIssueClose);

	app.on("issue_comment.created", async (context: Context<"issue_comment.created">) => {
		const { body } = context.payload.comment;
		const { command, args } = getCommandAndArgs(body);

		if (command[0] === "/" && !context.isBot) {
			await context.octokit.reactions.createForIssueComment({
				...context.issue(),
				comment_id: context.payload.comment.id,
				content: "rocket",
			});
		}

		switch (command) {
			case Commands.WIP:
				await handleWIPCommand(context);
				break;
			case Commands.APPROVE:
				await handleApproveCommand(context);
				break;
			case Commands.CLOSE:
				await handleCloseCommand(context);
				break;
			case Commands.LABEL:
				await handleLabelCommand(context, args);
				break;
			case Commands.MERGE:
				await handleMergeCommand(context);
				break;
			case Commands.REQUEST_INFO:
				await handleRequestMoreInfoCommand(context, args);
				break;
			// ... other commands

			default:
				if (command[0] === "/" && !context.isBot) {
					await context.octokit.reactions.createForIssueComment({
						...context.issue(),
						comment_id: context.payload.comment.id,
						content: "-1",
					});

					await createComment(
						context,
						`**${command}** command doesn't exist.\n${availableCommandsMessage}`,
					);
				}

				// if (context.isBot) {
				// 	await deleteComment(context);
				// }
				break;
		}
	});
};
