/**
 * The Policies add-on (docs/design/add-ons.md): who works on each task (assignment: the task's assignee and candidates,
 * its lane's group, roles, assignment policies), who may see and do what (security policies), and who is told what
 * (notification policies). One add-on, three parts: each part may read another's work, inside the add-on. It depends
 * on the engine only.
 */
import type { IAddOn, IAddOnManifest, IModelCheck } from '../../engine/AddOns.js';
import manifest from './addon.json' with { type: 'json' };
import { assignmentAddOn } from './assignment/index.js';
import { notificationAddOn } from './notification/index.js';
import { securityAddOn } from './security/index.js';
import { actorsName, actorElements, actorsOf, ACTOR_ELEMENTS, BUILT_IN_ACTORS } from './actors.js';

export * from './assignment/index.js';
export * from './notification/index.js';
export * from './security/index.js';
export * from './actors.js';
export { assignmentAddOn, notificationAddOn, securityAddOn };

export const policiesManifest: IAddOnManifest = manifest as IAddOnManifest;

/**
 * The whole model, checked: an `owf:actor` only where it means something (a user task, a start event), each
 * `actors.<name>` the model and the decisions it uses read one its elements name (or every instance has), and each
 * lane a role.
 */
const actorsCheck: IModelCheck = {
    name: 'policies',
    verifyModel(check, { source, definition, decisions }) {
        for (const node of definition.nodes.values())
            if (node.def?.$attrs?.['owf:actor'] && !ACTOR_ELEMENTS.includes(node.type))
                check.add('warning', 'actor-element', `owf:actor '${node.def.$attrs['owf:actor']}' is on a ${String(node.type).replace('bpmn:', '')}: an actor is the user who completes a user task, or starts the process at a start event; it is ignored here.`, node.def);
        const known = new Set<string>([...BUILT_IN_ACTORS, ...actorElements(source).values()]);
        const places: [string, string][] = [['the model', source], ...decisions.map(d => [d.what, d.text] as [string, string])];
        const unknown = new Map<string, string[]>();
        for (const [what, text] of places)
            for (const [, actor] of text.matchAll(/\bactors\.([A-Za-z_]\w*)/g))
                if (!known.has(actor) && !(unknown.get(actor) ?? []).includes(what))
                    unknown.set(actor, [...(unknown.get(actor) ?? []), what]);
        for (const [actor, where] of unknown)
            check.add('warning', 'actor-unknown', `actors.${actor} (${where.join(', ')}): no element of the model is the actor '${actor}' (owf:actor); its actors are ${[...known].join(', ')}.`);

        // a lane is a role, its tasks offered to its group: one the roles don't name
        const roles = check.roles();
        if (roles) {
            const lanes = new Map<string, any>();
            for (const node of definition.nodes.values()) if (node.lane && !lanes.has(node.lane)) lanes.set(node.lane, node.def);
            for (const [lane, def] of lanes)
                if (!roles.includes(lane))
                    check.add('warning', 'role-unknown', `Lane '${lane}' is not a role (roles.json, app-contract.json: ${roles.join(', ')}).`, def);
        }
    },
};

/** Its parts registered in order: who works on a task is decided before anyone is told. Actors, a name every expression sees. */
export const policiesAddOn: IAddOn = {
    name: manifest.name,
    register(server) {
        server.registrations.addExpressionName(actorsName);
        server.registrations.addModelCheck(actorsCheck);
        // the case's actors, kept on it (instance.actors, docs/design/context-object.md): worked out again as its work
        // starts and ends, when its data and who did what change; saved with it
        server.listener.subscribe({
            async onEvent({ type, context }) {
                if (!['start', 'end', 'assign', 'process.end'].includes(type)) return;
                const instance = context?.instance;
                const definition = context?.execution?.definition;
                if (!instance || !definition) return;
                instance.actors = actorsOf({ instance, items: context.execution.getItems?.() ?? instance.items ?? [], elements: actorElements(definition) });
            },
        });
        // a case saved before 3.7.5 has no actors: worked out as it is read, from its items and its model (no migration)
        server.registrations.addInstanceReader((instance) => {
            if (instance && !instance.actors && Array.isArray(instance.items))
                instance.actors = actorsOf({ instance, elements: actorElements(instance.source) });
        });
        for (const part of [assignmentAddOn, notificationAddOn, securityAddOn]) part.register(server);
    },
};
