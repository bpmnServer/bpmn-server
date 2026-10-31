export * from 'bpmn-server';
import type { WorkflowApplication } from '../runtime/WorkflowApplication.js';
import path from 'node:path';
import { configuration } from './configuration.js';

/** Bundled example application used by the standalone bpmn-web executable. */
export const sampleWorkflowApplication: WorkflowApplication = {
    configuration,
    // the sample's configured tasks (they call its appServices); the same folder from src/ and dist/
    elementTemplatesPath: process.env.ELEMENT_TEMPLATES_PATH || path.join(import.meta.dirname, '..', '..', 'elementTemplates'),
};

export { configuration };
