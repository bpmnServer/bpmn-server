import fs from 'node:fs';
import path from 'node:path';

/** A saved version of a model. */
export interface IModelVersion {
    version: number;
    /** when it was saved (ISO): its file's time */
    savedAt: string;
    /** who saved it, when known */
    savedBy?: string;
    /** its size in bytes: its file's */
    size: number;
}

const pad = (version: number) => String(version).padStart(4, '0');

// 0002.bpmn, or 0002.ann.bpmn when ann saved it (a user name is encoded: any character goes in a file name)
const fileName = (version: number, savedBy?: string) =>
    pad(version) + (savedBy ? '.' + encodeURIComponent(savedBy).replace(/\*/g, '%2A') : '') + '.bpmn';
const VERSION_FILE = /^(\d+)(?:\.(.+))?\.bpmn$/;

/**
 * A model's history: every save kept, as files beside the models, in `<models folder>/.history/<name>/`: one file
 * per version, `0001.bpmn`, or `0001.<user>.bpmn` with who saved it. When it was saved and its size are the file's.
 * A save that changes nothing adds nothing. The first save of a model that has a file but no history keeps that
 * file first, as it was (with its time). Purging removes the model's history folder.
 */
export class ModelHistory {
    /** Saves of a model's history take turns in this process, by its folder: two saves at once are two versions. */
    private static readonly turns = new Map<string, Promise<unknown>>();

    constructor(private readonly folder: string) { }

    private dir(name: string) {
        const root = path.join(this.folder, '.history');
        const dir = path.join(root, name);
        if (path.dirname(dir) !== root || !name || name.startsWith('.'))
            throw new Error(`not a model name: ${name}`);
        return dir;
    }

    /** The version files: [{ version, savedBy, file }], newest first. */
    private async files(name: string) {
        let files: string[];
        try {
            files = await fs.promises.readdir(this.dir(name));
        }
        catch (error) {
            if (error.code === 'ENOENT') return [];
            throw error;
        }
        return files.map(file => VERSION_FILE.exec(file)).filter(Boolean)
            .map(([file, version, savedBy]) => ({ version: Number(version), savedBy: savedBy && decodeURIComponent(savedBy), file }))
            .sort((a, b) => b.version - a.version || a.file.localeCompare(b.file));
    }

    /** The model's versions, newest first. */
    async list(name: string): Promise<IModelVersion[]> {
        const dir = this.dir(name);
        const versions: IModelVersion[] = [];
        for (const { version, savedBy, file } of await this.files(name)) {
            try {
                const stat = await fs.promises.stat(path.join(dir, file));
                versions.push({ version, savedAt: stat.mtime.toISOString(), ...(savedBy ? { savedBy } : {}), size: stat.size });
            }
            catch { /* removed meanwhile: not listed */ }
        }
        return versions;
    }

    /** A version's model, or null when there is no such version. */
    async source(name: string, version: number): Promise<string | null> {
        const found = (await this.files(name)).find(f => f.version === version);
        if (!found)
            return null;
        try {
            return await fs.promises.readFile(path.join(this.dir(name), found.file), 'utf8');
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
        const previous = ModelHistory.turns.get(dir) ?? Promise.resolve();
        const turn = previous.catch(() => undefined).then(() => this.keepNow(dir, name, source, savedBy, before));
        ModelHistory.turns.set(dir, turn);
        try {
            return await turn;
        }
        finally {
            if (ModelHistory.turns.get(dir) === turn)
                ModelHistory.turns.delete(dir);
        }
    }

    private async keepNow(dir: string, name: string, source: string, savedBy?: string, before?: { source: string; savedAt: Date }) {
        await fs.promises.mkdir(dir, { recursive: true });
        let versions = await this.list(name);
        if (!versions.length && before && before.source !== source) {
            await this.write(dir, name, 1, before.source, undefined, before.savedAt);
            versions = await this.list(name);
        }
        const latest = versions[0];
        if (latest && await this.source(name, latest.version) === source)
            return null;
        for (let version = (latest?.version ?? 0) + 1; ; version++) {
            if ((await this.files(name)).some(f => f.version === version))
                continue;
            const kept = await this.write(dir, name, version, source, savedBy);
            if (kept)
                return kept;
        }
    }

    /** Writes a version's file; null when the number is taken (by a save in another process), to try the next. */
    private async write(dir: string, name: string, version: number, source: string, savedBy?: string, savedAt?: Date): Promise<IModelVersion | null> {
        const file = path.join(dir, fileName(version, savedBy));
        try {
            await fs.promises.writeFile(file, source, { flag: 'wx' });
        }
        catch (error) {
            if (error.code === 'EEXIST') return null;
            throw error;
        }
        if ((await this.files(name)).some(f => f.version === version && f.file !== path.basename(file))) {
            await fs.promises.rm(file, { force: true });
            return null;
        }
        if (savedAt)
            await fs.promises.utimes(file, savedAt, savedAt);
        const stat = await fs.promises.stat(file);
        return { version, savedAt: stat.mtime.toISOString(), ...(savedBy ? { savedBy } : {}), size: stat.size };
    }

    /** Removes the model's history; returns how many versions it had. */
    async purge(name: string): Promise<number> {
        const count = (await this.files(name)).length;
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
