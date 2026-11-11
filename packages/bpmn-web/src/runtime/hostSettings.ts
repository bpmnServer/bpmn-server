/**
 * The API's settings of one server: its keys, its service account, impersonation. Read through the request's server
 * (`hostSettings(req)`), never from `process.env` at request time (docs/design/multi-app-tenants.md §8.2), so a server
 * of a workspace (3.8) gives its own: `start({ hostSettings })`, `WorkflowApplication.hostSettings`.
 *
 * The default reads `.env`'s values when asked, as the API always has: a value changed while the server runs holds
 * from the next call.
 */
export interface HostSettings {
    /** API_KEY: the service key (/api, /api2, /api/v3). */
    apiKey?: string;
    /** ADMIN_API_KEY: the administration APIs' key (/admin/api, /admin/api2). */
    adminApiKey?: string;
    /** API_ACTING_USER_KEY: the task API's key (/api2/tasks); none, that API is off. */
    actingUserKey?: string;
    /** API_IMPERSONATION=true: /api acts as the user a call names (until 4.0). */
    impersonation: boolean;
    /** The service account the keys act as: API_SERVICE_USER_NAME, _GROUPS, _TENANT_ID, _MODELS_OWNER. */
    serviceAccount: { userName?: string; groups: string[]; tenantId?: string; modelsOwner?: string };
}

/** A server's settings, made when asked. */
export type HostSettingsSource = () => HostSettings;

/** The default: `.env`'s values (process.env), read when asked. */
export const envHostSettings: HostSettingsSource = () => ({
    apiKey: process.env.API_KEY || undefined,
    adminApiKey: process.env.ADMIN_API_KEY || undefined,
    actingUserKey: process.env.API_ACTING_USER_KEY || undefined,
    impersonation: process.env.API_IMPERSONATION?.toLowerCase() === 'true',
    serviceAccount: {
        userName: process.env.API_SERVICE_USER_NAME || undefined,
        groups: (process.env.API_SERVICE_USER_GROUPS ?? '').split(',').map(g => g.trim()).filter(Boolean),
        tenantId: process.env.API_SERVICE_TENANT_ID,
        modelsOwner: process.env.API_SERVICE_MODELS_OWNER,
    },
});

/** The settings of the server a request came to (the WebApp sets its source on its Express app). */
export function hostSettings(req?): HostSettings {
    const source: HostSettingsSource | undefined = req?.app?.get?.('hostSettings');
    return (source ?? envHostSettings)();
}
