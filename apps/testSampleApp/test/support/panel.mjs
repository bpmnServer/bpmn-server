// The model editor's properties panel, for the UI tests.

/**
 * Opens a properties group and returns once it is open. The editor opens a group that has values by itself, just
 * after a selection; a click that read the header closed before that closes it again (seen on the CI runner, where
 * a group stayed shut and its fields hidden). So a click is followed by a wait for the group to be open, and is
 * repeated if it ended shut.
 */
export async function openGroup(page, label) {
    const header = page.locator('.bio-properties-panel-group-header', { hasText: label }).first();
    await header.waitFor();
    const open = async () => /\bopen\b/.test(await header.getAttribute('class') ?? '');
    for (let tries = 0; tries < 5; tries++) {
        if (await open()) return header;
        await header.click();
        const until = Date.now() + 1000;
        while (Date.now() < until && !(await open())) await page.waitForTimeout(50);
    }
    if (!(await open())) throw new Error(`the properties group '${label}' did not stay open`);
    return header;
}
