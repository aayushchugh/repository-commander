import type { Context } from "probot";
import { addLabel, listLabelsOnIssue } from "../utils/label.util";
import { Labels } from "../constants/enums";

export async function handleIssueClose(context: Context<"issues.closed">) {
	const issueLabels = await listLabelsOnIssue(context);

	const hasBugLabel = issueLabels.data.find((label) => label.name === Labels.BUG);
	const hasFeatureLabel = issueLabels.data.find(
		(label) => label.name === Labels.FEATURE || label.name === Labels.ENHANCEMENT,
	);

	if (hasBugLabel) {
		await addLabel(context, Labels.FIXED);
	}

	if (hasFeatureLabel) {
		await addLabel(context, Labels.IMPLEMENTED);
	}
}
