/**
 * The names of the application's services, read from its delegate's source when the server starts (scanServices.ts:
 * nothing of it runs), for what knows the application without its code: the editor and the model checks when the
 * engine runs elsewhere or not at all, and /llms.txt. Where the source is: the configuration's `delegateFile`, else
 * delegates/appDelegate.ts (or .js) in the working folder. Not found or not readable: null, and the engine is asked.
 */
import fs from 'node:fs';
import path from 'node:path';
import { scanServices } from '../scanServices.js';

const DEFAULTS = ['delegates/appDelegate.ts', 'delegates/appDelegate.js'];

/** The delegate's source file: the configuration's, else the first default there. */
export function delegateSourceOf(configuration): string | null {
    const candidates = configuration?.delegateFile ? [configuration.delegateFile] : DEFAULTS;
    return candidates.map(file => path.resolve(file)).find(file => fs.existsSync(file)) ?? null;
}

/** The names, read once at start: started here, waited for by whoever needs them. */
export async function serviceNamesAtStart(configuration): Promise<string[] | null> {
    if (configuration?.servicesFile)
        console.warn('[services] servicesFile is no longer read: the names come from the delegate\'s source (delegateFile)');
    const file = delegateSourceOf(configuration);
    if (!file) {
        console.log(`[services] no delegate source (${configuration?.delegateFile ?? DEFAULTS[0]}): their names are the engine's`);
        return null;
    }
    try {
        const scanned = await scanServices(file);
        console.log(`[services] ${scanned.services.length} from ${path.relative(process.cwd(), file) || file}${scanned.partial ? ' (some out of reach: a class from a package, or made as it runs)' : ''}`);
        return scanned.services;
    }
    catch (error) {
        console.warn(`[services] ${path.relative(process.cwd(), file)} could not be read (${error?.message ?? error}): their names are the engine's`);
        return null;
    }
}
