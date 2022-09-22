import type { Context } from "probot";
import Label from "../utils/label.util";

async function addLabelToIssueOnClose(context: Context<"issues.closed">) {
	const label = new Label(context);
	const issueLabels = await label.listIssueLabels();

	const previousBugLabel = issueLabels.data.find((label) => label.name === "bug");

	const previousFeatureLabel = issueLabels.data.find(
		(label) => label.name === "feature" || label.name === "enhancement",
	);

	if (previousBugLabel) {
		label.add("fixed");
	}

	if (previousFeatureLabel) {
		label.add("implemented");
	}
}

export default addLabelToIssueOnClose;
