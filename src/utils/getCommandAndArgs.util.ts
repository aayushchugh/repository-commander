export function getCommandAndArgs(body: string): { command: string; args: string[] } {
	const split = body.trim().split(" ");
	const command = split[0].toLowerCase();
	const args = split.slice(1);

	return { command, args };
}
