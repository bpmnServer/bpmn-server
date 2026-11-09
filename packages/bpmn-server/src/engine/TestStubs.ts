/** What a test replaces, by service name and by timer element id. */
export interface StubSet {
    services: Record<string, (input: any, data: any) => Promise<any>>;
    /** a timer's seconds */
    timers: Record<string, number>;
}

/**
 * The stubs of the tests running in this engine, by the instances they started and those instances' called processes.
 * Only a test running in here adds to them: no engine call, start option or instance flag reaches them, for a stub is code.
 */
export class TestStubs {
    #byInstance = new Map<string, StubSet>();

    constructor(private readonly server) { }

    add(instanceId: string, stubs: StubSet) { this.#byInstance.set(instanceId, stubs); }

    /** A test ended: its stubs are gone, from its instances and what they called. */
    remove(stubs: StubSet) {
        for (const [id, set] of this.#byInstance)
            if (set === stubs) this.#byInstance.delete(id);
    }

    /** The stubs of the instance an execution runs: its own, or those of the instance that called it. */
    async of(execution): Promise<StubSet | undefined> {
        if (!this.#byInstance.size) return undefined;
        const { id, parentItemId } = execution.instance;
        const own = this.#byInstance.get(id);
        if (own || !parentItemId) return own;
        const [caller] = await this.server.dataStore.findInstances({ 'items.id': parentItemId }, 'summary');
        const stubs = caller && this.#byInstance.get(caller.id);
        if (stubs) this.add(id, stubs);
        return stubs;
    }
}
