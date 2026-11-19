/**
 * Which environment this server is (docs/docs/environments.md): APP_ENV, development, test or production, with its
 * label (APP_ENV_LABEL) and whether it is read-only (READ_ONLY). The pages show it as a band, coloured by the
 * environment, so nobody mistakes a test server for production; API v3's /me says it.
 *
 * Unset APP_ENV is an environment not declared: it works as before 3.7.2 (tests run), and shows no band unless it
 * has a label or is read-only.
 */
export type EnvironmentName = 'development' | 'test' | 'production';

export interface ServerEnvironment {
    /** APP_ENV, when it is one of the three; null when unset (or not one of them). */
    name: EnvironmentName | null;
    /** What the band says: APP_ENV_LABEL, else Development or Test; production shows none unless labelled. */
    label: string | null;
    /** READ_ONLY=true: the processes and the server's setup can't be changed (runtime/readOnly.ts). */
    readOnly: boolean;
    /** Whether the pages show the band. */
    shown: boolean;
}

const NAMES: EnvironmentName[] = ['development', 'test', 'production'];
const TITLES: Record<EnvironmentName, string | null> = { development: 'Development', test: 'Test', production: null };

export const isReadOnly = () => (process.env.READ_ONLY ?? '').trim().toLowerCase() === 'true';

export function serverEnvironment(env: NodeJS.ProcessEnv = process.env): ServerEnvironment {
    const raw = (env.APP_ENV ?? '').trim().toLowerCase();
    const name = (NAMES as string[]).includes(raw) ? raw as EnvironmentName : null;
    const label = (env.APP_ENV_LABEL ?? '').trim() || (name ? TITLES[name] : null);
    const readOnly = (env.READ_ONLY ?? '').trim().toLowerCase() === 'true';
    return { name, label, readOnly, shown: !!label || readOnly };
}
