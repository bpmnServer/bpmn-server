/**
 * OWF's own model attributes (docs/design/owf-namespace.md). An attribute bpmn-server invents is in the `owf:`
 * namespace; `camunda:` is only for what Camunda defines. The four that were written as `camunda:` before are read
 * under both names: `owf:` first, then the old `camunda:` one, so models saved before keep working.
 */

/** The `owf:` namespace's URI, as a model declares it: xmlns:owf="http://omniworkflow.com/schema/owf/1.0". */
export const OWF_NAMESPACE = 'http://omniworkflow.com/schema/owf/1.0';

/** OWF's attributes once written as `camunda:` (Camunda does not define them). */
export const LEGACY_CAMUNDA = ['assignmentPolicy', 'label', 'endLabel', 'exceptionsAsErrors'] as const;

/** An element's (or a process's) OWF attribute: `owf:<name>`, else the old `camunda:<name>`. */
export function owfAttribute(def: any, name: string): any {
    const attrs = def?.$attrs ?? {};
    return attrs[`owf:${name}`] ?? attrs[`camunda:${name}`];
}

/** The OWF attributes an element still has under the old `camunda:` name. */
export function legacyAttributes(def: any): string[] {
    const attrs = def?.$attrs ?? {};
    return LEGACY_CAMUNDA.filter(name => attrs[`camunda:${name}`] !== undefined);
}
