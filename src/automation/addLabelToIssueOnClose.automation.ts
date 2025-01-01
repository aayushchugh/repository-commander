import type { Context } from "probot";
import { addLabel, listLabelsOnIssue } from "../utils/label.util";

export async function handleIssueClose(context: Context<"issues.closed">) {
	const issueLabels = await listLabelsOnIssue(context);

	const hasBugLabel = issueLabels.data.find((label) => label.name === "bug");
	const hasFeatureLabel = issueLabels.data.find(
		(label) => label.name === "feature" || label.name === "enhancement",
	);

	if (hasBugLabel) {
		await addLabel(context, "fixed");
	}

	if (hasFeatureLabel) {
		await addLabel(context, "implemented");
	}
}
