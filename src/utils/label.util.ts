import type { Context } from "probot";
import randomColor from "randomcolor";

export async function listLabelsForRepo(context: Context<"pull_request" | "issues">) {
	return await context.octokit.issues.listLabelsForRepo(context.repo());
}

export async function listLabelsOnIssue(context: Context<"pull_request" | "issues">) {
	return (await context.octokit.issues.listLabelsOnIssue(context.issue())) as {
		data: Array<{ name: string }>;
	};
}

export async function createLabel(
	context: Context<"pull_request" | "issues">,
	name: string,
	color?: string,
) {
	return await context.octokit.issues.createLabel({
		...context.repo(),
		name,
		color: color || randomColor().split("#")[1],
	});
}

export async function addLabel(
	context: Context<"pull_request" | "issues">,
	name: string | string[],
	color?: string,
) {
	const repoLabels = await listLabelsForRepo(context);
	const issueLabels = await listLabelsOnIssue(context);

	if (typeof name === "string") {
		const labelExists = repoLabels.data.find((label) => label.name === name);
		const labelOnIssue = issueLabels.data.find((label) => label.name === name);

		if (!labelExists) {
			await createLabel(context, name, color);
		}

		if (!labelOnIssue) {
			await context.octokit.issues.addLabels({
				...context.issue(),
				labels: [name],
			});
		}
	}

	if (Array.isArray(name)) {
		for (const labelName of name) {
			const labelExists = repoLabels.data.find((label) => label.name === labelName);
			const labelOnIssue = issueLabels.data.find((label) => label.name === labelName);

			if (!labelExists) {
				await createLabel(context, labelName, color);
			}

			if (!labelOnIssue) {
				await context.octokit.issues.addLabels({
					...context.issue(),
					labels: name,
				});
			}
		}
	}

	return null;
}

export async function removeLabel(context: Context<"pull_request" | "issues">, name: string) {
	const issueLabels = await listLabelsOnIssue(context);
	const labelExists = issueLabels.data.find((label) => label.name === name);

	if (labelExists) {
		return await context.octokit.issues.removeLabel({
			...context.issue(),
			name,
		});
	}

	return null;
}
