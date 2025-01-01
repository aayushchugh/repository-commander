export interface BotConfig {
	minBodyLength: number;
	commands: {
		wip: boolean;
		approve: boolean;
		close: boolean;
		label: boolean;
		merge: boolean;
		requestInfo: boolean;
	};
	automation: {
		addReadyForReview: boolean;
		addApprovedLabel: boolean;
		addChangesRequestedLabel: boolean;
		addMergedLabel: boolean;
		removeClosedLabel: boolean;
		requestMoreInfo: boolean;
		addLabelsOnClose: boolean;
		welcomeContributor: boolean;
		welcomeIssue: boolean;
	};
	labels: {
		wip: string;
		readyForReview: string;
		approved: string;
		changesRequested: string;
		needsMoreInfo: string;
		merged: string;
		closed: string;
		bug: string;
		feature: string;
		enhancement: string;
		fixed: string;
		implemented: string;
	};
	colors: {
		red: string;
		orange: string;
		gray: string;
		green: string;
	};
	messages: {
		welcomeContributor: string;
		welcomeIssue: string;
		requestMoreInfo: string;
		moreInfoAdded: string;
	};
}

export const defaultConfig: BotConfig = {
	minBodyLength: 20,
	commands: {
		wip: true,
		approve: true,
		close: true,
		label: true,
		merge: true,
		requestInfo: true,
	},
	automation: {
		addReadyForReview: true,
		addApprovedLabel: true,
		addChangesRequestedLabel: true,
		addMergedLabel: true,
		removeClosedLabel: true,
		requestMoreInfo: true,
		addLabelsOnClose: true,
		welcomeContributor: true,
		welcomeIssue: true,
	},
	labels: {
		wip: "WIP",
		readyForReview: "ready for review",
		approved: "approved",
		changesRequested: "changes requested",
		needsMoreInfo: "needs more info",
		merged: "merged",
		closed: "closed",
		bug: "bug",
		feature: "feature",
		enhancement: "enhancement",
		fixed: "fixed",
		implemented: "implemented",
	},
	colors: {
		red: "AA2626",
		orange: "B60205",
		gray: "383214",
		green: "28A745",
	},
	messages: {
		welcomeContributor:
			`Thanks for your first pull request, @{user}! 🎉\n\n` +
			`The team will review your changes soon. In the meantime, please make sure:\n` +
			`- [ ] Tests pass\n` +
			`- [ ] Documentation is updated (if needed)\n` +
			`- [ ] Commit messages follow our guidelines\n\n` +
			`Welcome to our community! 🚀`,
		welcomeIssue:
			`Thanks for opening your first issue, @{user}! 🎉\n\n` +
			`We appreciate you taking the time to contribute to the project.\n` +
			`Someone will respond to your issue soon. 👍`,
		requestMoreInfo:
			`Hey @{user}! We need more information to help you better. Please provide more details about what you're trying to accomplish here.\n\n` +
			`Please edit your {type} to include more details.`,
		moreInfoAdded: `@{user} Thanks for adding more information! I've removed the needs more info label.`,
	},
};
