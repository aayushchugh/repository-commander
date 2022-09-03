import type { Context } from "probot";
import randomColor from "randomcolor";
import { listRepoLabels, listIssueLabels } from "./listLabels.util";

/**
 * Add a label to an issue
 * @param {string[]} names - Array of label names to add
 * @param {Context} context Probot context
 * @param {string | undefined} color  Label color
 */
export async function addLabel(
	names: string[],
	context: Context,
	color?: string
) {
	const labelsFromRepo = await listRepoLabels(context);
	const labelsFromIssue = await listIssueLabels(context);

	names.forEach(name => {
		const labelFromRepo = labelsFromRepo.data.filter(
			label => label.name === name
		);

		const labelFromIssue = labelsFromIssue.data.filter(
			label => label.name === name
		);

		if (labelFromRepo.length === 0) {
			console.log("if");
			if (color) createLabel(name, context, color);
			else createLabel(name, context);
		}

		if (labelFromIssue.length === 0) {
			const newLabels = context.issue({
				labels: names,
			});

			context.octokit.issues.addLabels(newLabels);
		}
	});
}

/**
 * Create a label
 * @param {string} name - Label name
 * @param {Context} context Probot context
 * @param {string} color - Label color
 */
export function createLabel(name: string, context: Context, color?: string) {
	const params = context.repo();

	return context.octokit.issues.createLabel({
		owner: params.owner,
		repo: params.repo,
		name: name,
		color: color || randomColor().split("#")[1],
	});
}

/**
 * Remove Label
 * @param {string} name - Label name
 * @param {Context} context Probot context
 */
export function removeLabel(name: string, context: Context) {
	const issue = context.issue({ name });

	return context.octokit.issues.removeLabel(issue);
}
