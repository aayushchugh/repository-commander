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
	},
};
