/**
 * May this user open a workflow page (an address under /workflow)? The Workbench (/workflow) is for administrators
 * and designers; Design, the catalog and the model editors for designers; Administration for administrators; Settings
 * for administrators and designers; AI Agent for everyone, while the AI Agents add-on is on (may.aiLink). Their tasks,
 * My Work and the rest are everyone's: BPMN Server decides what each shows them.
 */
export function mayOpenWorkflow(path, may) {
  const at = path.replace(/^\/workflow/, '') || '/';
  if (at === '/' || at === '/?owf') return may.design || may.administer;
  if (/^\/dashboard\/admin\b/.test(at)) return may.administer;
  if (/^\/dashboard\/(integration|settings)\b/.test(at)) return may.design || may.administer;
  if (/^\/dashboard\/(design|catalog)\b/.test(at) || /^\/model\//.test(at)) return may.design;
  if (/^\/ai\b/.test(at)) return !!may.aiLink;
  return true;
}
