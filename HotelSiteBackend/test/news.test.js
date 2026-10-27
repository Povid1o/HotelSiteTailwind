const assert = require('node:assert/strict');
const test = require('node:test');

const { slugify, uniqueSlug } = require('../utils/slug');
const { sanitizeNewsHtml, textStats } = require('../utils/newsHtml');

test('slugify transliterates Russian titles', () => {
  assert.equal(slugify('Сбор урожая 2026: приглашаем на виноградники'), 'sbor-urozhaya-2026-priglashaem-na-vinogradniki');
  assert.equal(slugify('Щедрый «Брют»!'), 'shchedryy-bryut');
  assert.equal(slugify('   '), 'news');
  assert.equal(slugify('!!!'), 'news');
});

test('slugify keeps addresses short without cutting words in half', () => {
  const slug = slugify('очень длинный заголовок новости '.repeat(10), 40);
  assert.ok(slug.length <= 40);
  assert.ok(!slug.endsWith('-'));
});

test('uniqueSlug adds a numeric suffix on collision', async () => {
  const taken = new Set(['festival', 'festival-2']);
  const slug = await uniqueSlug('festival', async (candidate) => taken.has(candidate));
  assert.equal(slug, 'festival-3');
  assert.equal(await uniqueSlug('other', async () => false), 'other');
});

test('sanitizer keeps editor output', () => {
  const html = '<h2>Заголовок</h2><p>Текст <strong>важный</strong> и <a href="/Hotel">ссылка</a></p><hr>'
    + '<blockquote><p>Цитата</p></blockquote>'
    + '<figure class="news-figure"><img src="/static/news/a.jpg" alt="Лоза"><figcaption>Подпись</figcaption></figure>'
    + '<div class="news-button-wrap"><a class="news-button" href="/Hotel">Забронировать</a></div>';
  const out = sanitizeNewsHtml(html);
  assert.match(out, /<h2>Заголовок<\/h2>/);
  assert.match(out, /<hr \/>/);
  assert.match(out, /<blockquote>/);
  assert.match(out, /<figcaption>Подпись<\/figcaption>/);
  assert.match(out, /class="news-button"/);
  assert.match(out, /loading="lazy"/);
});

test('sanitizer removes scripts, handlers and dangerous links', () => {
  const out = sanitizeNewsHtml(
    '<p onclick="x()">a</p><script>alert(1)</script><img src="x" onerror="alert(1)">'
    + '<a href="javascript:alert(1)">bad</a><iframe src="https://evil.test"></iframe>'
    + '<a href="//evil.test/x">proto</a><img src="data:image/png;base64,AAAA">'
  );
  assert.ok(!/script|onclick|onerror|iframe|javascript:|data:/i.test(out), out);
  assert.ok(!out.includes('//evil.test'), out);
});

test('external links open safely', () => {
  const out = sanitizeNewsHtml('<a href="https://example.test">x</a>');
  assert.match(out, /rel="noopener noreferrer"/);
  assert.match(out, /target="_blank"/);
});

test('textStats counts words and reading time', () => {
  assert.deepEqual(textStats('<p>раз два три</p>'), { wordCount: 3, readingMinutes: 1 });
  const long = `<p>${'слово '.repeat(400)}</p>`;
  assert.equal(textStats(long).readingMinutes, 3);
  assert.deepEqual(textStats(''), { wordCount: 0, readingMinutes: 1 });
});
