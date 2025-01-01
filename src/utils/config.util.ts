import type { Context } from "probot";
import { defaultConfig, type BotConfig } from "../config/defaults";

export async function getConfig(context: Context): Promise<BotConfig> {
	const config = await context.config<BotConfig>("repository-commander.yml");
	return { ...defaultConfig, ...config };
}
