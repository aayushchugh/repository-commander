import { removeLabel, addLabel } from "../utils/label.util";
import { listIssueLabels } from "../utils/listLabels.util";
import type { Context } from "probot";

/**
 * This is main function which will run on /label command
 *
 * @param {*} context  Probot context
 * @param {*} args  Arguments passed to the command
 */
async function labelCommand(context: Context<"issue_comment.created">, args: string[]) {
	const labelsFromIssue = await listIssueLabels(context);
	const labelsToAdd: string[] = [];

	args.forEach((label) => {
		const foundIssueLabel = labelsFromIssue.data.find(
			(issueLabel) => issueLabel.name === label,
		);

		if (foundIssueLabel) {
			removeLabel(label, context);
		} else {
			labelsToAdd.push(label);
		}
	});

	if (labelsToAdd.length > 0) {
		addLabel(labelsToAdd, context);
	}
}

export default labelCommand;
