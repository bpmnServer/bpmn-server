/*
 * GET /llms.txt: where an AI agent given only this site's address starts. Three parts, in Markdown:
 *   1. This site, as it is now: its version, its API and OpenAPI document, whether design is on, the services and
 *      connectors a model can call, the user groups in use (their names only).
 *   2. This site's own guide, when the installation has one: AI_GUIDE, else settings/ai-guide.md in the application.
 *   3. BPMN Server's guide for agents building workflows (docs/ai/building-workflows.md), shipped in the package, so it
 *      is the one of this version; its links point to the published documentation.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { designDisabled } from '../userAccess/roles.js';
import { UserService } from '../userAccess/UserService.js';
import { originOf } from './modelApi.js';

const PACKAGE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DOCS = 'https://bpmnserver.github.io/bpmn-server/';

/** BPMN Server's guide: the package's copy, else the repository's docs (a checkout). */
function standardGuide(): string {
    for (const file of [path.join(PACKAGE, 'ai', 'building-workflows.md'), path.join(PACKAGE, '..', '..', 'docs', 'docs', 'ai', 'building-workflows.md')])
        if (fs.existsSync(file))
            // its links are the docs' own (../testing.md): here, the published pages
            return fs.readFileSync(file, 'utf8').replace(/\]\((?:\.\.\/)?([\w./-]+?)\.md(#[\w-]*)?\)/g, (_, page, anchor = '') => `](${DOCS}${page}/${anchor})`);
    return `See ${DOCS}ai/building-workflows/`;
}

/** The installation's own guide for agents, if it has one. */
function siteOwnGuide(): string | null {
    const file = process.env.AI_GUIDE || path.resolve('settings', 'ai-guide.md');
    return fs.existsSync(file) ? fs.readFileSync(file, 'utf8').trim() : null;
}

/** Which environment this site is (APP_ENV): a test one has its own services, which reach nothing outside. */
function environment(): string {
    const env = process.env.APP_ENV || 'production';
    return env === 'test'
        ? '**test** (APP_ENV=test): its services are the test environment\'s, with the same names; nothing is sent or recorded outside. Test here freely'
        : `**${env}**: services are real (they send, they record). Build and test models on a test site; a scenario can still replace a service with \`@stub service:<name>\``;
}

async function facts(webApp, origin: string) {
    const server = webApp.bpmnServer;
    const list = items => items.length ? items.map(i => `\`${i}\``).join(', ') : 'none';
    let services: string[] = [];
    try { services = JSON.parse(fs.readFileSync(server.configuration.servicesFile ?? path.resolve('services.json'), 'utf8')).services ?? []; } catch { /* none listed */ }
    let connectors: string[] = [];
    try { connectors = (await server.connectors?.list() ?? []).filter(c => c.enabled !== false).map(c => c.id); } catch { /* none */ }
    let groups: string[] = [];
    try { groups = [...new Set((await new UserService().listUsers()).flatMap(u => u.userGroups ?? []))].sort() as string[]; } catch { /* no users here */ }
    return [
        `- BPMN Server ${webApp.packageJson?.version ?? ''}`.trimEnd(),
        `- API: ${origin}/api2, its key in the \`x-api-key\` header (or a person's link from ${origin}/ai/key: it acts as them, for minutes). The OpenAPI document: ${origin}/api2/openapi.json (no key needed)`,
        `- Creating and changing models, running their tests: ${designDisabled() ? '**off** on this site (DISABLE_DESIGN)' : 'on'}`,
        `- Environment: ${environment()}`,
        `- Services a model can call (\`camunda:delegateExpression\` or \`implementation\`): ${list(services)}. Anything else is not on this site: use a script task`,
        `- Connectors (\`camunda:connector\`): ${list(connectors)}`,
        `- User groups in use: ${list(groups)}. Give each role a lane named as its group: the lane's tasks are offered to that group (\`@login ... with role of\` in tests)`,
        `- A model opens in the editor at ${origin}/model/edit/<name>, for a person signed in to this site (the API key does not open it)`,
    ].join('\n');
}

export async function siteGuide(webApp, req): Promise<string> {
    const origin = originOf(req);
    const own = siteOwnGuide();
    return [
        `# ${new URL(origin).host}: BPMN Server, for AI agents`,
        '',
        'Build, check, deploy and test BPMN workflows on this site, through its API. Read this page first: this site, its own rules, then how BPMN Server works.',
        '',
        '## This site',
        '',
        await facts(webApp, origin),
        '',
        ...(own ? ['## This site\'s own guide', '', own, ''] : []),
        '## How to build workflows on BPMN Server',
        '',
        standardGuide().replace(/^# .*\n/, ''),
    ].join('\n');
}
