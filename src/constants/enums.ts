export enum Labels {
	READY_FOR_REVIEW = "ready for review",
	APPROVED = "approved",
	CHANGES_REQUESTED = "changes requested",
	WIP = "WIP",
	MERGED = "merged",
	CLOSED = "closed",
	NEEDS_MORE_INFO = "needs more info",
	BUG = "bug",
	FEATURE = "feature",
	ENHANCEMENT = "enhancement",
	FIXED = "fixed",
	IMPLEMENTED = "implemented",
}

export enum ReviewStates {
	APPROVED = "APPROVED",
	CHANGES_REQUESTED = "CHANGES_REQUESTED",
	COMMENTED = "COMMENTED",
	DISMISSED = "DISMISSED",
}

export enum Colors {
	RED = "AA2626",
	ORANGE = "B60205",
	GRAY = "383214",
}

export enum Commands {
	WIP = "/wip",
	APPROVE = "/approve",
	CLOSE = "/close",
	LABEL = "/label",
	MERGE = "/merge",
	REQUEST_INFO = "/request-info",
}
