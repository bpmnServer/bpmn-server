// @features: api-v3
// API v3's reference page (docs/docs/api-v3.md) is its OpenAPI document's (routes/api/openapi-v3.ts, built). To fix:
// change the document, then `npm run api-docs`.
import test from 'node:test';
import assert from 'node:assert/strict';
import { upToDate, render } from '../../../../scripts/api-docs.mjs';

test('docs/docs/api-v3.md is made from the API\'s document: npm run api-docs', async () => {
    assert.ok(await upToDate(), 'docs/docs/api-v3.md is out of date: npm run api-docs');
});

test('the page has each operation, its body\'s fields, and the shapes; a < in a description is text', () => {
    const page = render({
        info: { description: 'Every call acts as one user.' },
        servers: [{ url: 'https://<site>/api/v3' }],
        paths: { '/rules/{name}': { post: {
            summary: 'Evaluate a rule', parameters: [{ name: 'name', in: 'path', required: true, schema: { type: 'string' }, description: 'A file <name>.dmn.xml' }],
            requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'object' } } } } } },
            responses: { 200: { description: 'What it decided', content: { 'application/json': { schema: { $ref: '#/components/schemas/RuleResult' } } } } },
        } } },
        components: {
            securitySchemes: { serviceKey: { type: 'apiKey', in: 'header', name: 'x-api-key', description: 'The service key' } },
            schemas: { RuleResult: { type: 'object', properties: { decision: { type: 'string' } } } },
        },
    });
    assert.match(page, /\| \[POST \/rules\/\{name\}\]\(#post-rulesname\) \| Evaluate a rule \|/);
    assert.match(page, /### POST \/rules\/\{name\}/);
    assert.match(page, /\| `name` \| path \| string \| yes \| A file &lt;name>\.dmn\.xml \|/);
    assert.match(page, /\| `data` \| object \|/);
    assert.match(page, /\| 200 \| What it decided \| \[RuleResult\]\(#ruleresult\) \|/);
    assert.match(page, /### RuleResult/);
});
