import type { Context } from "probot";
import Comment from "../utils/comment.util";
import Label from "../utils/label.util";

export async function requestMoreInfo(context: Context<"issues.opened">) {
	const { body } = context.payload.issue;
	const comment = new Comment(context);
	const label = new Label(context);

	if (!body || body.length < 20) {
		comment.create(`Hey There! @${context.payload.issue.user.login} You didn't give us a whole lot of information about this issue. We would love if you could provide more details about what you're trying to accomplish here.
            Please edit your issue to include more details.`);

		label.add(":eyes: needs more info", "B60205");
	}
}

export async function removeRequestMoreInfoLabel(context: Context<"issues.edited">) {
	const { body } = context.payload.issue;
	const comment = new Comment(context);
	const label = new Label(context);
	const issueLabels = await label.listIssueLabels();
	const foundNeedsMoreInfoLabel = issueLabels.data.find(
		(label: any) => label.name === ":eyes: needs more info",
	);

	if (foundNeedsMoreInfoLabel && body && body.length > 20) {
		comment.create(
			`@${context.payload.issue.user.login} Thanks for adding more information to this issue! I've removed the ":eyes: needs more info" label.`,
		);

		label.remove(":eyes: needs more info");
	}
}
