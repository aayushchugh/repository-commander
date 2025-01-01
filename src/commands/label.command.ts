import type { Context } from "probot";
import { createComment } from "../utils/comment.util";
import { addLabel } from "../utils/label.util";

export async function handleLabelCommand(
	context: Context<"issue_comment.created">,
	args: string[],
) {
	try {
		// Check for empty args
		if (!args.length) {
			await createComment(context, "Please provide at least one label name to add.");
			return;
		}

		// Check for maximum labels
		if (args.length > 10) {
			await createComment(context, "You can only add up to 10 labels at once.");
			return;
		}

		// Validate label names
		const invalidLabels = args.filter((label) => !/^[a-zA-Z0-9-_\s]+$/.test(label));
		if (invalidLabels.length > 0) {
			await createComment(
				context,
				`Invalid label names: ${invalidLabels.join(", ")}. Labels can only contain letters, numbers, hyphens, and underscores.`,
			);
			return;
		}

		await addLabel(context, args);
		// await createComment(
		// 	context,
		// 	`Added ${args.length > 1 ? "labels" : "label"} as requested by @${context.payload.comment.user.login}`,
		// );
	} catch (error) {
		console.error("Error in handleLabelCommand:", error);
		await createComment(context, "An error occurred while adding labels.");
	}
}
