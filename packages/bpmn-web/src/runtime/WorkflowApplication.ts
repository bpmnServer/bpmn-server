import type { BPMNServer, IConfiguration, ILogger } from 'bpmn-server';
import type { IUserManager } from '../userAccess/IUserManager.js';
import type { HostSettingsSource } from './hostSettings.js';

/**
 * Application-owned dependencies consumed by the reusable workflow web host.
 *
 * The web adapter knows how to expose a workflow runtime over HTTP. The
 * application remains responsible for definitions, persistence and
 * service implementations through IConfiguration.
 */
export interface WorkflowApplication {
	configuration: IConfiguration;
	logger?: ILogger;
	serverOptions?: Record<string, unknown>;
	initialize?: (server: BPMNServer) => void;
	/** A folder of element templates (Camunda 7 format, *.json) the model editor offers: configured tasks. */
	elementTemplatesPath?: string;
	/** The REST APIs (/api, /api2 and their /admin forms); default true. */
	api?: boolean;
	/** The web pages (tasks, instances, model editor, administration) and their files; default true. */
	ui?: boolean;
	/**
	 * The application's own routes, mounted before bpmn-web's: before the APIs' JSON 404 and before the UI
	 * router at '/', which sends any request without a session to /login. Mount under '/api' (with apiKeyAuth)
	 * to extend the REST API; a path bpmn-web also serves answers from the application first.
	 */
	routes?: (app, webApp) => void;
	/**
	 * Who signs in: the application's own users, sessions and sign-in (IUserManager). Without it, bpmn-web's own:
	 * its users and sessions on the engine's store, its sign-in pages and first-run page.
	 */
	userManager?: IUserManager;
	/** The API's settings (keys, service account, impersonation) of this server; default `.env`'s (hostSettings.ts). */
	hostSettings?: HostSettingsSource;
}

export function defineWorkflowApplication(application: WorkflowApplication): WorkflowApplication {
	return application;
}
