/**
 * The secrets the server stores (each connector's own key), at rest: AES-256-GCM, with a key from SECRETS_KEY (in
 * .env, never in the database). A stored secret is `v1:<iv>:<tag>:<ciphertext>`, base64; it reads back only with the
 * same key. SECRETS_KEY was CONNECTORS_KEY before 3.7.5: that name is still read, and the log says once to rename it.
 */
import crypto from 'node:crypto';

const VERSION = 'v1';

/** The variable that holds the key, and its name before 3.7.5. */
export const SECRETS_KEY = 'SECRETS_KEY';
export const OLD_SECRETS_KEY = 'CONNECTORS_KEY';

let told = false;

/** The server's key for the secrets it stores: SECRETS_KEY, else CONNECTORS_KEY (its name before 3.7.5, said once). */
export function secretsKey(env: NodeJS.ProcessEnv = process.env, warn: (message: string) => void = console.warn): string | undefined {
    if (env[SECRETS_KEY]) return env[SECRETS_KEY];
    const old = env[OLD_SECRETS_KEY];
    if (old && !told) {
        told = true;
        warn(`[settings] ${OLD_SECRETS_KEY} is now ${SECRETS_KEY} (3.7.5): rename it in .env, keeping its value; ${OLD_SECRETS_KEY} is read until then`);
    }
    return old || undefined;
}

/** The encryption key, from SECRETS_KEY (any length: hashed to 32 bytes); none: an error saying so. */
function encryptionKey(secretKey = secretsKey()): Buffer {
    if (!secretKey)
        throw new Error(`Connector keys need ${SECRETS_KEY} (a long random value) in .env: the keys are stored encrypted with it`);
    return crypto.createHash('sha256').update(secretKey, 'utf8').digest();
}

/** Whether keys can be stored: SECRETS_KEY (or CONNECTORS_KEY, before 3.7.5) is set. */
export function canEncrypt(): boolean {
    return Boolean(secretsKey());
}

export function encrypt(plain: string, secretKey?: string): string {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey(secretKey), iv);
    const data = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
    return [VERSION, iv.toString('base64'), cipher.getAuthTag().toString('base64'), data.toString('base64')].join(':');
}

export function decrypt(stored: string, secretKey?: string): string {
    const [version, iv, tag, data] = String(stored).split(':');
    if (version !== VERSION || !iv || !tag || data === undefined)
        throw new Error('The connector\'s key is not in a form this server reads');
    try {
        const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey(secretKey), Buffer.from(iv, 'base64'));
        decipher.setAuthTag(Buffer.from(tag, 'base64'));
        return Buffer.concat([decipher.update(Buffer.from(data, 'base64')), decipher.final()]).toString('utf8');
    }
    catch {
        throw new Error(`The connector's key does not decrypt: ${SECRETS_KEY} is not the one it was stored with`);
    }
}
