import Label from "../utils/label.util";
import type { Context } from "probot";

/**
 * This is main function which will run on /label command
 *
 * @param {*} context  Probot context
 * @param {*} args  Arguments passed to the command
 */
async function labelCommand(context: Context<"issue_comment.created">, args: string[]) {
	const labelsToAdd: string[] = [];
	const label = new Label(context);
	const labelsFromIssue = await label.listIssueLabels();

	args.forEach((name) => {
		const foundIssueLabel = labelsFromIssue.data.find((issueLabel) => issueLabel.name === name);

		if (foundIssueLabel) {
			label.remove(name);
		} else {
			labelsToAdd.push(name);
		}
	});

	if (labelsToAdd.length > 0) {
		label.add(labelsToAdd);
	}
}

export default labelCommand;
