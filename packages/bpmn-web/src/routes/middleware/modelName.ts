/** The filesystem model store concatenates model names into paths. */
export function isSafeModelName(value: unknown): boolean {
    return typeof value === 'string' && value.length > 0 && value.length <= 128 &&
        !value.includes('..') && !/[\\/\x00-\x1f]/.test(value);
}

export function modelNameGuard(req, res, next): void {
    const keys = ['name', 'newName', 'process', 'processName', 'processId', 'file'];
    for (const source of [req.params, req.body]) {
        if (!source) continue;
        for (const key of keys) {
            if (source[key] !== undefined && !isSafeModelName(source[key])) {
                res.status(400).send('Invalid model name');
                return;
            }
        }
    }
    next();
}

/**
 * Check a model's name in a route's own path (/edit/:process): modelNameGuard, on the router, runs before the route
 * is matched and does not see it. On any router with such a route, so that a new one is covered too.
 */
export function guardModelParams(router): void {
    for (const param of ['name', 'process', 'processName', 'file'])
        router.param(param, (req, res, next, value) => {
            if (isSafeModelName(value)) next();
            else res.status(400).send('Invalid model name');
        });
}
