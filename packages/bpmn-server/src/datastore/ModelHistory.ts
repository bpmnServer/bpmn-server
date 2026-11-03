import fs from 'node:fs';
import path from 'node:path';

/** A saved version of a model. */
export interface IModelVersion {
    version: number;
    /** when it was saved (ISO); for the version kept from before the history, the file's time */
    savedAt: string;
    /** who saved it, when known */
    savedBy?: string;
    /** its size in bytes */
    size: number;
}

const pad = (version: number) => String(version).padStart(4, '0');

/**
 * A model's history: every save kept, as files beside the models, in `<models folder>/.history/<name>/`:
 * `0001.bpmn` the model as saved and `0001.json` its record (`IModelVersion`). A save that changes nothing adds
 * nothing. The first save of a model that has a file but no history keeps that file first, as it was.
 * Purging removes the model's history folder.
 */
export class ModelHistory {
    constructor(private readonly folder: string) { }

    private dir(name: string) {
        const root = path.join(this.folder, '.history');
        const dir = path.join(root, name);
        if (path.dirname(dir) !== root || !name || name.startsWith('.'))
            throw new Error(`not a model name: ${name}`);
        return dir;
    }

    /** The model's versions, newest first. */
    async list(name: string): Promise<IModelVersion[]> {
        const dir = this.dir(name);
        let files: string[];
        try {
            files = await fs.promises.readdir(dir);
        }
        catch (error) {
            if (error.code === 'ENOENT') return [];
            throw error;
        }
        const versions: IModelVersion[] = [];
        for (const file of files.filter(f => /^\d+\.json$/.test(f))) {
            try {
                versions.push(JSON.parse(await fs.promises.readFile(path.join(dir, file), 'utf8')));
            }
            catch { /* a record being written, or damaged: not listed */ }
        }
        return versions.sort((a, b) => b.version - a.version);
    }

    /** A version's model, or null when there is no such version. */
    async source(name: string, version: number): Promise<string | null> {
        try {
            return await fs.promises.readFile(path.join(this.dir(name), pad(version) + '.bpmn'), 'utf8');
        }
        catch (error) {
            if (error.code === 'ENOENT') return null;
            throw error;
        }
    }

    /**
     * Keeps a save: the next version, unless the model is the latest version already. `before` is the model's
     * file as it was before this save (kept first when the model has no history yet). Returns the version kept,
     * or null.
     */
    async keep(name: string, source: string, savedBy?: string, before?: { source: string; savedAt: Date }): Promise<IModelVersion | null> {
        const dir = this.dir(name);
        await fs.promises.mkdir(dir, { recursive: true });
        let versions = await this.list(name);
        if (!versions.length && before && before.source !== source) {
            await this.write(dir, 1, before.source, { savedAt: before.savedAt.toISOString() });
            versions = await this.list(name);
        }
        const latest = versions[0];
        if (latest && await this.source(name, latest.version) === source)
            return null;
        // the next number, claimed by creating its file: two saves at once get two versions
        for (let version = (latest?.version ?? 0) + 1; ; version++) {
            try {
                return await this.write(dir, version, source, { savedAt: new Date().toISOString(), savedBy });
            }
            catch (error) {
                if (error.code !== 'EEXIST') throw error;
            }
        }
    }

    private async write(dir: string, version: number, source: string, record: { savedAt: string; savedBy?: string }) {
        await fs.promises.writeFile(path.join(dir, pad(version) + '.bpmn'), source, { flag: 'wx' });
        const kept: IModelVersion = { version, savedAt: record.savedAt, ...(record.savedBy ? { savedBy: record.savedBy } : {}), size: Buffer.byteLength(source) };
        await fs.promises.writeFile(path.join(dir, pad(version) + '.json'), JSON.stringify(kept, null, 2));
        return kept;
    }

    /** Removes the model's history; returns how many versions it had. */
    async purge(name: string): Promise<number> {
        const count = (await this.list(name)).length;
        await fs.promises.rm(this.dir(name), { recursive: true, force: true });
        return count;
    }

    /** The history follows the model to its new name. */
    async rename(name: string, newName: string): Promise<void> {
        try {
            await fs.promises.rename(this.dir(name), this.dir(newName));
        }
        catch (error) {
            if (error.code !== 'ENOENT') throw error;
        }
    }
}
