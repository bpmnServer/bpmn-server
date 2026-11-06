/*
 * What runs on this server: a setting for each thing. Set in the environment, one wins; else its value here, in the
 * table's column for DEMO_MODE=true or its default.
 */
export const DEMO_MODE_SETTINGS = {
    SCRIPT_SANDBOX: true,               // scripts and expressions run in a sandbox
    SCRIPT_SANDBOX_SERVICES: false,     // with the sandbox: scripts' calls to appServices and appUtils run
    TIMERS: false,                      // timers run
    SERVICE_TASKS: false,               // service tasks and connectors run
};
const DEFAULTS = { SCRIPT_SANDBOX: false, SCRIPT_SANDBOX_SERVICES: true, TIMERS: true, SERVICE_TASKS: true };

export type RunSetting = keyof typeof DEFAULTS;

const fromEnvironment = (): Record<RunSetting, string | undefined> => ({
    SCRIPT_SANDBOX: process.env.SCRIPT_SANDBOX,
    SCRIPT_SANDBOX_SERVICES: process.env.SCRIPT_SANDBOX_SERVICES,
    TIMERS: process.env.TIMERS,
    SERVICE_TASKS: process.env.SERVICE_TASKS,
});

export function runSetting(name: RunSetting): boolean {
    const value = fromEnvironment()[name];
    if (value)
        return value.toLowerCase().startsWith('true');
    return process.env.DEMO_MODE?.toLowerCase().startsWith('true') ? DEMO_MODE_SETTINGS[name] : DEFAULTS[name];
}
