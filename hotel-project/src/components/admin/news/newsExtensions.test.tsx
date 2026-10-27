import { getSchema } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { DOMParser as PMParser, DOMSerializer, Node as PMNode } from '@tiptap/pm/model';
// Сеть тесту не нужна: подменяем http-слой, чтобы не тянуть axios.
jest.mock('../../http', () => ({ STATIC_BASE: '', $authHost: {}, $host: {} }));
jest.mock('../../http/newsAPI', () => ({ uploadNewsImage: jest.fn() }));

import { NewsButton, NewsImage, checkNewsImage } from './newsExtensions';

const schema = getSchema([
  StarterKit.configure({ heading: { levels: [2, 3, 4] }, code: false, codeBlock: false }),
  Underline,
  Link.configure({ openOnClick: false }),
  NewsButton,
  NewsImage,
]);

const toHtml = (json: any) => {
  const holder = document.createElement('div');
  holder.appendChild(DOMSerializer.fromSchema(schema).serializeFragment(PMNode.fromJSON(schema, json).content));
  return holder.innerHTML;
};

const fromHtml = (html: string) => {
  const holder = document.createElement('div');
  holder.innerHTML = html;
  return PMParser.fromSchema(schema).parse(holder).toJSON();
};

const doc = {
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Что вас ждёт' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'Жирный', marks: [{ type: 'bold' }] }] },
    { type: 'newsImage', attrs: { src: '/static/news/a.jpg', alt: 'Виноградник' }, content: [{ type: 'text', text: 'Подпись' }] },
    { type: 'newsButton', attrs: { text: 'Выбрать даты', href: '/Hotel' } },
    { type: 'horizontalRule' },
    { type: 'blockquote', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Цитата' }] }] },
  ],
};

describe('news editor blocks', () => {
  it('writes the markup the public page and the sanitizer expect', () => {
    const html = toHtml(doc);
    expect(html).toContain('<h2>Что вас ждёт</h2>');
    expect(html).toContain('<figure class="news-figure"><img src="/static/news/a.jpg" alt="Виноградник"><figcaption>Подпись</figcaption></figure>');
    expect(html).toContain('<div class="news-button-wrap"><a class="news-button" href="/Hotel">Выбрать даты</a></div>');
    expect(html).toContain('<hr>');
    expect(html).toContain('<blockquote><p>Цитата</p></blockquote>');
  });

  it('reads its own markup back into the same blocks', () => {
    const back = fromHtml(toHtml(doc));
    const types = back.content.map((n: any) => n.type);
    expect(types).toEqual(['heading', 'paragraph', 'newsImage', 'newsButton', 'horizontalRule', 'blockquote']);
    expect(back.content[2].attrs).toEqual({ src: '/static/news/a.jpg', alt: 'Виноградник' });
    expect(back.content[2].content[0].text).toBe('Подпись');
    expect(back.content[3].attrs).toEqual({ text: 'Выбрать даты', href: '/Hotel' });
  });

  it('accepts only photos the server will take', () => {
    expect(checkNewsImage(new File(['x'], 'a.jpg', { type: 'image/jpeg' }))).toBeNull();
    expect(checkNewsImage(new File(['x'], 'a.gif', { type: 'image/gif' }))).toMatch(/JPG/);
    const big = new File(['x'], 'a.png', { type: 'image/png' });
    Object.defineProperty(big, 'size', { value: 11 * 1024 * 1024 });
    expect(checkNewsImage(big)).toMatch(/10 МБ/);
  });
});
