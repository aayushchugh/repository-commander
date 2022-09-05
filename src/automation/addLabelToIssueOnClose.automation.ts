import type { Context } from "probot";
import { addLabel } from "../utils/label.util";
import { listIssueLabels } from "../utils/listLabels.util";

async function addLabelToIssueOnClose(context: Context) {
	const issueLabels = await listIssueLabels(context);

	const previousBugLabel = issueLabels.data.find((label) => label.name === "bug");

	const previousFeatureLabel = issueLabels.data.find(
		(label) => label.name === "feature" || label.name === "enhancement",
	);

	if (previousBugLabel) {
		addLabel(["fixed"], context);
	}

	if (previousFeatureLabel) {
		addLabel(["implemented"], context);
	}
}

export default addLabelToIssueOnClose;
