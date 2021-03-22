const ROOT = 'http://localhost:3000';

describe('seo', () => {
  it('should have a canonical tag', async () => {
    await page.goto(`${ROOT}/starter/`, {waitUntil: 'networkidle2'});
    let el = await page.$('link[rel=canonical]');
    let hasCanonicalTag = Boolean(el);
    await expect(hasCanonicalTag).toBe(true);
  });
})
