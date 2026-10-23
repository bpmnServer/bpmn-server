import { EventEmitter } from "events";
import type { ILifecycleListener } from "../interfaces/lifecycle.js";

/**
 * The server's event bus. Its legacy face is a Node EventEmitter: `on(event, fn)` listeners run
 * synchronously within the engine's step, and one that throws aborts it, as before. Its lifecycle
 * face (`subscribe`) is awaited after them, each subscriber isolated: a failure is reported to
 * `onSubscriberError` (the server's logger) and the execution continues (lifecycle.ts).
 */
class Listener extends EventEmitter {
    private readonly lifecycleListeners = new Set<ILifecycleListener>();
    /** Where a subscriber's failure goes; the server sets its logger's. */
    onSubscriberError: (error: unknown, event: string) => void = (error) => console.error(error);

    clearSubscriptions(): void { this.lifecycleListeners.clear(); }

    subscribe(listener: ILifecycleListener): () => void {
        this.lifecycleListeners.add(listener);
        return () => { this.lifecycleListeners.delete(listener); };
    }

    /** Emits `event` to the legacy listeners and then to `all`, then notifies each lifecycle subscriber in turn. */
    async dispatch(event: string, payload: { event: string; context: any; eventDetails?: unknown }): Promise<void> {
        this.emit(event, payload);
        this.emit('all', payload);
        for (const listener of [...this.lifecycleListeners]) {
            try {
                await listener.onEvent({ type: event, context: payload.context, details: payload.eventDetails });
            }
            catch (error) {
                this.onSubscriberError(error, event);
            }
        }
    }

    /** @deprecated The engine dispatches through `dispatch`; kept for callers of the earlier form. */
    async doEvent(event, execution, item = null, eventDetails = {}) {
        execution.item = item;
        await this.dispatch(event, { event, context: execution, eventDetails });
    }
}

export {Listener}
