import test from 'node:test';
import assert from 'node:assert/strict';
import pug from 'pug';

const template = 'src/views/includes/dashboardHeader.pug';

test('dashboard renders without request.user when authentication is disabled', () => {
  const previous = process.env.REQUIRE_AUTHENTICATION;
  process.env.REQUIRE_AUTHENTICATION = 'false';
  try {
    const request = { session: {} };
    const user = { userName: 'system', userGroups: ['SYSTEM'] };
    const html = pug.renderFile(template, { request, user });
    assert.match(html, /name="forUserName"[^>]*value="system"/);
    assert.match(html, /name="forUserGroups"[^>]*value="SYSTEM"/);

    request.session.forUser = { userName: 'alice', userGroups: ['Sales', 'Review'] };
    const selected = pug.renderFile(template, { request, user });
    assert.match(selected, /name="forUserName"[^>]*value="alice"/);
    assert.match(selected, /name="forUserGroups"[^>]*value="Sales,Review"/);
  } finally {
    if (previous === undefined) delete process.env.REQUIRE_AUTHENTICATION;
    else process.env.REQUIRE_AUTHENTICATION = previous;
  }
});

test('dashboard hides user selector when authentication is enabled', () => {
  const previous = process.env.REQUIRE_AUTHENTICATION;
  process.env.REQUIRE_AUTHENTICATION = 'true';
  try {
    const html = pug.renderFile(template, { request: { session: {} }, user: undefined });
    assert.doesNotMatch(html, /forUserName/);
  } finally {
    if (previous === undefined) delete process.env.REQUIRE_AUTHENTICATION;
    else process.env.REQUIRE_AUTHENTICATION = previous;
  }
});
