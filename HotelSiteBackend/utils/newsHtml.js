const sanitizeHtml = require('sanitize-html');

// Что редактор Tiptap может создать, то и разрешаем: абзацы, заголовки, списки,
// выделение, ссылки, цитату, линию, фото с подписью и блок-кнопку.
// Всё остальное (script, iframe, style, обработчики on*) вырезается.
const options = {
  allowedTags: [
    'h2', 'h3', 'h4', 'p', 'br', 'hr', 'strong', 'b', 'em', 'i', 'u', 's',
    'a', 'ul', 'ol', 'li', 'blockquote', 'figure', 'figcaption', 'img', 'div'
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel', 'class'],
    img: ['src', 'alt', 'loading'],
    div: ['class'],
    figure: ['class']
  },
  allowedClasses: {
    a: ['news-button'],
    div: ['news-button-wrap'],
    figure: ['news-figure']
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: { img: ['http', 'https'] },
  allowProtocolRelative: false,
  transformTags: {
    a: (tagName, attribs) => {
      const href = attribs.href || '';
      const external = /^https?:\/\//i.test(href);
      const next = { ...attribs };
      if (external) {
        next.target = '_blank';
        next.rel = 'noopener noreferrer';
      } else {
        delete next.target;
        delete next.rel;
      }
      return { tagName, attribs: next };
    },
    img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: 'lazy' } })
  }
};

const sanitizeNewsHtml = (html) => sanitizeHtml(String(html || ''), options);

const plainText = (html) =>
  sanitizeHtml(String(html || ''), { allowedTags: [], allowedAttributes: {} })
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Около 180 слов в минуту — спокойная скорость чтения, минимум одна минута.
const textStats = (html) => {
  const text = plainText(html);
  const wordCount = text ? text.split(' ').length : 0;
  return { wordCount, readingMinutes: Math.max(1, Math.ceil(wordCount / 180)) };
};

module.exports = { sanitizeNewsHtml, plainText, textStats };
