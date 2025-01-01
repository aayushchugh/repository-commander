import type { Context } from "probot";
import { createComment } from "../utils/comment.util";
import { addLabel } from "../utils/label.util";

export async function handleLabelCommand(
	context: Context<"issue_comment.created">,
	args: string[],
) {
	if (!args.length) {
		await createComment(context, "Please provide at least one label name to add.");
		return;
	}

	await addLabel(context, args);
	await createComment(
		context,
		`Added ${args.length > 1 ? "labels" : "label"} as requested by @${context.payload.comment.user.login}`,
	);
}
