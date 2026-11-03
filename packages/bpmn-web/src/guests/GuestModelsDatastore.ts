import fs from 'node:fs';
import path from 'node:path';
import { ModelsDatastore, ModelsDatastoreDB, MemoryDocumentStore, Definition } from 'bpmn-server';

import { currentGuest, maxGuestModels, type GuestContext } from './guests.js';

/**
 * The models store with guests (GUEST_ACCESS=true). Outside a guest's request it is the usual store: the
 * application's folder and its database records. In a guest's request the folder is the guest's (see
 * guestConfiguration) and nothing goes to the shared database: a guest's model records (their events, for start
 * events and messages) are made in memory from its files.
 */
export class GuestModelsDatastore extends ModelsDatastore {
    /** Each guest's records in memory, with the file times they were made from; the least recently used dropped. */
    private records = new Map<string, { store: ModelsDatastoreDB; times: Map<string, number> }>();
    private static readonly KEPT = 100;

    async save(name, bpmn, svg?, owner = null, savedBy?: string): Promise<boolean> {
        const guest = currentGuest();
        if (!guest)
            return super.save(name, bpmn, svg, owner, savedBy);
        const file = this.file(guest, name, 'bpmn');
        if (!fs.existsSync(file) && this.names(guest).length >= maxGuestModels())
            throw new Error(`a guest may have ${maxGuestModels()} models: delete one first`);
        // parsing it first: a model that does not load leaves the files as they were
        await new Definition(name, bpmn, this.server).load();
        const before = await this.before(file);
        write(file, bpmn);
        if (svg)
            write(this.file(guest, name, 'svg'), svg);
        await this.keepVersion(this.modelHistory, name, bpmn, savedBy, before);
        return true;
    }

    async deleteModel(name, owner = null): Promise<void> {
        const guest = currentGuest();
        if (!guest)
            return super.deleteModel(name, owner);
        for (const type of ['bpmn', 'svg'])
            fs.rmSync(this.file(guest, name, type), { force: true });
        await this.modelHistory.purge(name);
    }

    async renameModel(name, newName, owner = null): Promise<boolean> {
        const guest = currentGuest();
        if (!guest)
            return super.renameModel(name, newName, owner);
        for (const type of ['bpmn', 'svg'])
            if (fs.existsSync(this.file(guest, name, type)))
                fs.renameSync(this.file(guest, name, type), this.file(guest, newName, type));
        await this.modelHistory.rename(name, newName);
        return true;
    }

    async rebuild(model = null) {
        if (!currentGuest())
            return super.rebuild(model);
    }

    async get(query = {}): Promise<object[]> {
        const guest = currentGuest();
        return guest ? (await this.guestRecords(guest)).get(query) : super.get(query);
    }

    async findEvents(query, owner = null) {
        const guest = currentGuest();
        return guest ? (await this.guestRecords(guest)).findEvents(query) : super.findEvents(query, owner);
    }

    async loadModel(name, owner = null) {
        const guest = currentGuest();
        return guest ? (await this.guestRecords(guest)).loadModel(name) : super.loadModel(name, owner);
    }

    private file(guest: GuestContext, name: string, type: string) {
        const file = path.join(guest.folder, `${name}.${type}`);
        if (path.dirname(file) + path.sep !== guest.folder)
            throw new Error(`not a model name: ${name}`);
        return file;
    }

    private names(guest: GuestContext) {
        return fs.readdirSync(guest.folder).filter(file => file.endsWith('.bpmn')).map(file => file.slice(0, -5));
    }

    /** The guest's model records, made again for the files changed since. */
    private async guestRecords(guest: GuestContext): Promise<ModelsDatastoreDB> {
        let entry = this.records.get(guest.id);
        if (entry)
            this.records.delete(guest.id);      // to the end: the most recently used
        else {
            const server = Object.create(this.server, { documentStore: { value: new MemoryDocumentStore() } });
            entry = { store: new ModelsDatastoreDB(server), times: new Map() };
        }
        this.records.set(guest.id, entry);
        if (this.records.size > GuestModelsDatastore.KEPT)
            this.records.delete(this.records.keys().next().value);

        const names = this.names(guest);
        for (const name of names) {
            const time = fs.statSync(this.file(guest, name, 'bpmn')).mtimeMs;
            if (entry.times.get(name) === time)
                continue;
            const svgFile = this.file(guest, name, 'svg');
            try {
                await entry.store.save(name, fs.readFileSync(this.file(guest, name, 'bpmn'), 'utf8'), fs.existsSync(svgFile) ? fs.readFileSync(svgFile, 'utf8') : null);
            }
            catch {
                // a model that does not load has no record, as in the database
            }
            entry.times.set(name, time);
        }
        for (const name of [...entry.times.keys()].filter(name => !names.includes(name))) {
            await entry.store.deleteModel(name);
            entry.times.delete(name);
        }
        return entry.store;
    }
}

/** Writes a file whole or not at all. */
function write(file: string, text: string) {
    const temporary = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(temporary, text);
    fs.renameSync(temporary, file);
}
