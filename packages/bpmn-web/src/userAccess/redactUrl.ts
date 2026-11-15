/** A connection string with its password replaced by ***, for the log: the log is no place for credentials. */
export function redactUrl(url: string | undefined): string | undefined {
    if (!url) return url;
    try {
        const parsed = new URL(url);
        if (parsed.password) parsed.password = '***';
        return parsed.toString();
    }
    catch {
        return url.replace(/\/\/([^:/@]+):[^@/]+@/, '//$1:***@');
    }
}
