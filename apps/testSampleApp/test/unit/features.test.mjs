// The feature catalog (docs/features.yaml): every docs, code and test reference is there, and the tests' tags are the
// catalog's. To fix: correct the catalog, then `npm run features` (it tags the tests and writes docs/docs/features.md).
import test from 'node:test';
import assert from 'node:assert/strict';
import { check, tagsUpToDate } from '../../../../scripts/features.mjs';

test('the feature catalog: its references are there, and the tests carry its tags', () => {
    const { problems, byTest } = check();
    assert.deepEqual(problems, []);
    assert.deepEqual(tagsUpToDate(byTest), [], 'tags out of date: npm run features');
});
