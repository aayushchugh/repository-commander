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
import { handleRequestMoreInfoCommand } from "./commands/requestMoreInfo.command";
import { getConfig } from "./utils/config.util";
import {
	welcomeFirstTimeContributor,
	welcomeFirstTimeIssue,
} from "./automation/welcome.automation";

const COMMANDS = {
	WIP: "/wip",
	APPROVE: "/approve",
	CLOSE: "/close",
	LABEL: "/label",
	MERGE: "/merge",
	REQUEST_INFO: "/request-info",
} as const;

const availableCommandsMessage = `Available commands are:- 
    - **/label** - Add labels to an issue or pull request.
    - **/close** - Close an issue or pull request.
    - **/approve** - Approve a pull request.
    - **/merge** - Merge a pull request.
    - **/WIP** - Add the WIP label.
    - **/request-info** - Request more information from the author.`;

export = (app: Probot) => {
	app.on("pull_request.opened", async (context) => {
		const config = await getConfig(context);
		if (config.automation.addReadyForReview) {
			await addReadyForReviewLabel(context);
		}
		await welcomeFirstTimeContributor(context);
	});

	app.on("pull_request_review.submitted", async (context) => {
		const config = await getConfig(context);
		if (config.automation.addApprovedLabel) {
			await addApprovedLabel(context);
		}
		if (config.automation.addChangesRequestedLabel) {
			await changesRequestLabel(context);
		}
	});

	app.on("pull_request.closed", async (context) => {
		const config = await getConfig(context);
		if (config.automation.addMergedLabel) {
			await addMergedLabel(context);
		}
	});

	app.on("pull_request.reopened", async (context) => {
		const config = await getConfig(context);
		if (config.automation.removeClosedLabel) {
			await removeClosedLabel(context);
		}
	});

	app.on("issues.opened", async (context) => {
		const config = await getConfig(context);
		if (config.automation.requestMoreInfo) {
			await requestMoreInfo(context);
		}
		await welcomeFirstTimeIssue(context);
	});

	app.on("issues.edited", async (context) => {
		const config = await getConfig(context);
		if (config.automation.requestMoreInfo) {
			await removeRequestMoreInfoLabel(context);
		}
	});

	app.on("issues.closed", async (context) => {
		const config = await getConfig(context);
		if (config.automation.addLabelsOnClose) {
			await handleIssueClose(context);
		}
	});

	app.on("issue_comment.created", async (context: Context<"issue_comment.created">) => {
		const { body } = context.payload.comment;
		const { command, args } = getCommandAndArgs(body);
		const config = await getConfig(context);

		if (command[0] === "/" && !context.isBot) {
			await context.octokit.reactions.createForIssueComment({
				...context.issue(),
				comment_id: context.payload.comment.id,
				content: "rocket",
			});
		}

		switch (command) {
			case COMMANDS.WIP:
				if (!config.commands.wip) {
					await createComment(context, "The WIP command is disabled.");
					return;
				}
				await handleWIPCommand(context);
				break;

			case COMMANDS.APPROVE:
				if (!config.commands.approve) {
					await createComment(context, "The approve command is disabled.");
					return;
				}
				await handleApproveCommand(context);
				break;

			case COMMANDS.CLOSE:
				if (!config.commands.close) {
					await createComment(context, "The close command is disabled.");
					return;
				}
				await handleCloseCommand(context);
				break;

			case COMMANDS.LABEL:
				if (!config.commands.label) {
					await createComment(context, "The label command is disabled.");
					return;
				}
				await handleLabelCommand(context, args);
				break;

			case COMMANDS.MERGE:
				if (!config.commands.merge) {
					await createComment(context, "The merge command is disabled.");
					return;
				}
				await handleMergeCommand(context);
				break;

			case COMMANDS.REQUEST_INFO:
				if (!config.commands.requestInfo) {
					await createComment(context, "The request-info command is disabled.");
					return;
				}
				await handleRequestMoreInfoCommand(context, args);
				break;

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
				break;
		}
	});
};
