import { randomBytes } from 'node:crypto';

let lastMs = 0, counter = 0;

/**
 * An id for a document stored without one, ordered by when it was made, as MongoDB's ObjectIds are: newest-first
 * paging by `_id` (the instance lists, `find` with `after`) means the same on every store. 24 hex characters: the
 * milliseconds (12), a counter within the millisecond (4), random (8). In one process each is greater than the last.
 */
export function orderedId(): string {
    const now = Date.now();
    if (now > lastMs) { lastMs = now; counter = 0; }
    else if (++counter > 0xffff) { lastMs++; counter = 0; }
    return lastMs.toString(16).padStart(12, '0') + counter.toString(16).padStart(4, '0') + randomBytes(4).toString('hex');
}
