import type { IUpgradeReport } from 'bpmn-server';

/**
 * npm run upgrade:running [--dry-run] [--json] [model ...]
 *
 * Moves running instances onto their model's current source (engine.upgradeRunning): with SAVE_SOURCE
 * each instance keeps the source it started with, so a corrected model does not reach it otherwise.
 * An instance whose open steps no longer exist in the new model is left alone (stranded) and reported.
 */
export interface UpgradeArgs {
	models: string[];
	dryRun: boolean;
	json: boolean;
	help: boolean;
	unknown: string[];
}

export function parseUpgradeArgs(argv: string[]): UpgradeArgs {
	const args: UpgradeArgs = { models: [], dryRun: false, json: false, help: false, unknown: [] };
	for (const arg of argv) {
		if (arg === '--dry-run' || arg === '-n') args.dryRun = true;
		else if (arg === '--json') args.json = true;
		else if (arg === '--help' || arg === '-h') args.help = true;
		else if (arg.startsWith('-')) args.unknown.push(arg);
		else args.models.push(arg);
	}
	return args;
}

export const upgradeUsage = 'usage: npm run upgrade:running -- [--dry-run] [--json] [model ...]\n'
	+ '  moves running instances onto their model\'s saved source; no model names = every model with running instances';

export interface UpgradeSummary {
	counts: Record<string, number>;
	refused: { model: string; reason: string }[];
	/** something needs attention: a refused model, a stranded, busy or failed instance */
	attention: boolean;
}

export function summarizeUpgrade(reports: IUpgradeReport[]): UpgradeSummary {
	const counts: Record<string, number> = {};
	const refused: UpgradeSummary['refused'] = [];
	for (const report of reports) {
		if (report.refused) refused.push({ model: report.model, reason: report.refused });
		for (const item of report.instances) counts[item.outcome] = (counts[item.outcome] ?? 0) + 1;
	}
	const attention = refused.length > 0 || ['stranded', 'busy', 'failed'].some(o => counts[o] > 0);
	return { counts, refused, attention };
}

export function formatUpgradeReport(reports: IUpgradeReport[], dryRun: boolean): string {
	const lines: string[] = [];
	for (const report of reports) {
		if (report.refused) {
			lines.push(`${report.model}: refused - ${report.refused}`);
			continue;
		}
		lines.push(`${report.model}: ${report.instances.length} instance(s)`);
		for (const item of report.instances)
			if (item.outcome !== 'current' && item.outcome !== 'ended')
				lines.push(`  ${item.instanceId} ${item.outcome}${item.detail ? ' - ' + item.detail : ''}`);
	}
	const { counts } = summarizeUpgrade(reports);
	const totals = Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(', ') || 'nothing to do';
	lines.push(`${dryRun ? 'dry run: ' : ''}${totals}`);
	return lines.join('\n');
}
