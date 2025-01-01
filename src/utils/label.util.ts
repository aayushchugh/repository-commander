import type { Context } from "probot";
import randomColor from "randomcolor";

class Label {
	private context:
		| Context<"issue_comment.created">
		| Context<"issues.opened">
		| Context<"issues.closed">
		| Context<"issues.edited">
		| Context<"pull_request.opened">
		| Context<"pull_request.closed">
		| Context<"pull_request.reopened">
		| Context<"pull_request_review.submitted">;
	private params: ReturnType<
		| Context<"issue_comment.created">["issue"]
		| Context<"issues.opened">["issue"]
		| Context<"issues.closed">["issue"]
		| Context<"issues.edited">["issue"]
		| Context<"pull_request.opened">["issue"]
		| Context<"pull_request.closed">["issue"]
		| Context<"pull_request.reopened">["issue"]
		| Context<"pull_request_review.submitted">["issue"]
	>;
	private repo: ReturnType<
		| Context<"issue_comment.created">["repo"]
		| Context<"issues.opened">["repo"]
		| Context<"issues.closed">["repo"]
		| Context<"issues.edited">["repo"]
		| Context<"pull_request.opened">["repo"]
		| Context<"pull_request.closed">["repo"]
		| Context<"pull_request.reopened">["repo"]
		| Context<"pull_request_review.submitted">["repo"]
	>;

	/**
	 * @param context Probot context
	 */
	constructor(
		context:
			| Context<"issue_comment.created">
			| Context<"issues.opened">
			| Context<"issues.closed">
			| Context<"issues.edited">
			| Context<"pull_request.opened">
			| Context<"pull_request.closed">
			| Context<"pull_request.reopened">
			| Context<"pull_request_review.submitted">,
	) {
		this.context = context;
		this.repo = context.repo();
		this.params = context.issue();
	}

	/**
	 * List all the labels in repository
	 */
	public async listRepoLabels(): Promise<
		Awaited<ReturnType<typeof this.context.octokit.issues.listLabelsForRepo>>
	> {
		return await this.context.octokit.issues.listLabelsForRepo(this.repo);
	}

	/**
	 * List all the labels on current issue
	 */
	public async listIssueLabels(): Promise<
		Awaited<ReturnType<typeof this.context.octokit.issues.listLabelsOnIssue>>
	> {
		return await this.context.octokit.issues.listLabelsOnIssue(this.params);
	}

	/**
	 * Create a new label for repo
	 * @param name name of the label to be created
	 * @param color Which color should be used for the label if color is not passed than random color will be used
	 */
	private async create(name: string, color?: string) {
		return await this.context.octokit.issues.createLabel({
			...this.repo,
			name,
			color: color || randomColor().split("#")[1],
		});
	}

	/**
	 * Add a Label to an issue or pull request
	 * @param names  Array of label names to add
	 * @param color color for the label if color is not passed than random color will be used
	 */
	public async add(name: string | string[], color?: string) {
		const repoLabels = await this.listRepoLabels();
		const issueLabels = await this.listIssueLabels();

		if (typeof name === "string") {
			const labelFromRepo = repoLabels.data.find((label) => label.name === name);
			const labelFromIssue = issueLabels.data.find((label) => label.name === name);

			if (!labelFromRepo) {
				this.create(name, color);
			}

			if (!labelFromIssue) {
				await this.context.octokit.issues.addLabels({
					...this.params,
					labels: [name],
				});
			}
		}

		if (Array.isArray(name)) {
			name.forEach(async (title) => {
				const labelFromRepo = repoLabels.data.find((label) => label.name === title);
				const labelFromIssue = issueLabels.data.find((label) => label.name === title);

				if (!labelFromRepo) {
					this.create(title, color);
				}

				if (!labelFromIssue) {
					await this.context.octokit.issues.addLabels({
						...this.params,
						labels: name,
					});
				}
			});
		}
	}

	/**
	 * Removes a label from current issue or pull request
	 * @param name name of the label to be removed
	 */
	public async remove(name: string) {
		const issueLabels = await this.listIssueLabels();

		const labelFromIssue = issueLabels.data.find((label) => label.name === name);

		if (labelFromIssue) {
			await this.context.octokit.issues.removeLabel({
				...this.params,
				name,
			});
		}
	}
}

export default Label;
