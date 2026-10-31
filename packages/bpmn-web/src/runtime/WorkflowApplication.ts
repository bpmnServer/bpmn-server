import type { BPMNServer, IConfiguration, ILogger } from 'bpmn-server';

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
}

export function defineWorkflowApplication(application: WorkflowApplication): WorkflowApplication {
	return application;
}
