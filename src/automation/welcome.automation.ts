import type { Context } from "probot";
import { createComment } from "../utils/comment.util";
import { getConfig } from "../utils/config.util";

export async function welcomeFirstTimeContributor(context: Context<"pull_request.opened">) {
	const config = await getConfig(context);
	if (!config.automation.welcomeContributor) return;

	const { sender } = context.payload;
	const pulls = await context.octokit.pulls.list({
		...context.repo(),
		state: "all",
		creator: sender.login,
	});

	if (pulls.data.length === 1) {
		const message = config.messages.welcomeContributor.replace("{user}", sender.login);
		await createComment(context, message);
	}
}

export async function welcomeFirstTimeIssue(context: Context<"issues.opened">) {
	const config = await getConfig(context);
	if (!config.automation.welcomeIssue) return;

	const { sender } = context.payload;
	const issues = await context.octokit.issues.listForRepo({
		...context.repo(),
		creator: sender.login,
		state: "all",
	});

	if (issues.data.length === 1) {
		const message = config.messages.welcomeIssue.replace("{user}", sender.login);
		await createComment(context, message);
	}
}
