/**
 * Internal engine lifecycle notifications: what happened to an execution (`process.start`,
 * `wait`, `end`, …: the {@link EXECUTION_EVENT} names), distinct from BPMN events (messages,
 * signals, timers, which the engine correlates itself) and from an application's business events.
 *
 * Delivery: in order, awaited, after the engine's own listeners and the application delegate.
 * A subscriber's failure is reported to the server's logger and does not abort the execution or
 * reach the other subscribers: a subscriber that must not miss a notification records it durably
 * itself (an outbox) and treats a repeat as a duplicate (`item.id` with the event identifies it).
 */
export type LifecycleNotification = {
  /** The event's name (an EXECUTION_EVENT value). */
  type: string;
  /** The execution it happened to. */
  context: any;
  details?: unknown;
};

export interface ILifecycleListener {
  onEvent(event: LifecycleNotification): Promise<void> | void;
}
