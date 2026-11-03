/**
 * Connectors' authorization keys at rest: AES-256-GCM, with a key from CONNECTORS_KEY (in .env, never in the
 * database). A stored secret is `v1:<iv>:<tag>:<ciphertext>`, base64; it reads back only with the same key.
 */
import crypto from 'node:crypto';

const VERSION = 'v1';

/** The encryption key, from CONNECTORS_KEY (any length: hashed to 32 bytes); none: an error saying so. */
function encryptionKey(secretKey = process.env.CONNECTORS_KEY): Buffer {
    if (!secretKey)
        throw new Error('Connector keys need CONNECTORS_KEY (a long random value) in .env: the keys are stored encrypted with it');
    return crypto.createHash('sha256').update(secretKey, 'utf8').digest();
}

/** Whether keys can be stored: CONNECTORS_KEY is set. */
export function canEncrypt(): boolean {
    return Boolean(process.env.CONNECTORS_KEY);
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
        throw new Error('The connector\'s key does not decrypt: CONNECTORS_KEY is not the one it was stored with');
    }
}
