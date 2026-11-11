import { safeLinkUrl, getMediaUrl } from './contentHelpers';

test('CMS links reject executable schemes, ambiguous authority and control characters', () => {
  for (const url of ['javascript:alert(1)', 'JaVaScRiPt:alert(1)', 'data:text/html,<script>alert(1)</script>', '//attacker.test', '/\\attacker.test', '\\attacker.test', 'java\nscript:alert(1)', 'https://user:pass@attacker.test', 'https://example.test/\nattack']) expect(safeLinkUrl(url)).toBe('#');
  for (const url of ['/Hotel', '/Shop/7', '#visit', 'https://example.test/', 'mailto:hotel@example.test', 'tel:+79990000000']) expect(safeLinkUrl(url)).toBe(url);
});
test('media cannot use executable schemes or a protocol-relative address', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,test', '//attacker.test', '/\\attacker.test']) expect(getMediaUrl(url)).toBe('');
  expect(getMediaUrl('/static/news/photo.jpg')).toBe('/static/news/photo.jpg');
});
