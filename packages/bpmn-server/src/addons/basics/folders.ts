/**
 * Where each policy add-on keeps its decision tables in the models folder: a folder of its own, named for it
 * (`assignment/`, `notification/`, `security/`). Before 3.7.5 they were under `policies/` (`policies/assignment/`, and
 * so on), and in 3.7.1's first try assignment policies were directly in `policies/`: those are moved to the add-on's
 * folder the first time it is read, and the log says so once. A file already in the new folder is kept, and the old one
 * left where it is.
 */
import fs from 'node:fs';
import path from 'node:path';

export type PolicyKind = 'assignment' | 'notification' | 'security';

/** The folder before 3.7.5 that held the policies' folders. */
export const OLD_POLICIES_FOLDER = 'policies';

const told = new Set<string>();

/** Moves what is in `from` into `to`, entry by entry (a folder into a folder of the same name): how many were moved. */
function moveInto(from: string, to: string, only?: (name: string) => boolean): number {
    let entries: fs.Dirent[];
    try { entries = fs.readdirSync(from, { withFileTypes: true }); }
    catch { return 0; }
    let moved = 0;
    for (const entry of entries) {
        if (only && !only(entry.name)) continue;
        const source = path.join(from, entry.name), target = path.join(to, entry.name);
        if (!fs.existsSync(target)) {
            fs.mkdirSync(to, { recursive: true });
            fs.renameSync(source, target);
            moved++;
        }
        else if (entry.isDirectory() && fs.statSync(target).isDirectory())
            moved += moveInto(source, target);
    }
    return moved;
}

/** Removes a folder that is empty, and returns whether it is gone. */
function removeIfEmpty(folder: string): boolean {
    try {
        if (fs.readdirSync(folder).length) return false;
        fs.rmdirSync(folder);
        return true;
    }
    catch { return false; }
}

/**
 * The add-on's folder in this models folder (`<definitionsPath>/<kind>`), its policies moved there first from where
 * they were before 3.7.5. `warn`: where the move is reported (once per folder).
 */
export function movePolicyFolder(definitionsPath: string, kind: PolicyKind, warn: (message: string) => void = console.warn): string {
    const folder = path.join(definitionsPath, kind);
    const old = path.join(definitionsPath, OLD_POLICIES_FOLDER);
    if (!definitionsPath || !fs.existsSync(old)) return folder;
    let moved = moveInto(path.join(old, kind), folder);
    removeIfEmpty(path.join(old, kind));
    // 3.7.1's first try: assignment policies directly in policies/
    if (kind === 'assignment')
        moved += moveInto(old, folder, name => /\.dmn\.xml$/i.test(name) && fs.statSync(path.join(old, name)).isFile());
    removeIfEmpty(old);
    const key = path.join(old, kind);
    if (moved && !told.has(key)) {
        told.add(key);
        warn(`[add-ons] ${OLD_POLICIES_FOLDER}/${kind}/ is now ${kind}/ in the models folder (3.7.5): ${moved} moved to ${folder}`);
    }
    return folder;
}
