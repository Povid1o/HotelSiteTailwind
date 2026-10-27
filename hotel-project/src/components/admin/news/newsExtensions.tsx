import React, { useRef, useState } from 'react';
import { Node, mergeAttributes, NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { uploadNewsImage } from '../../http/newsAPI';
import { mediaSrc } from '../../news/newsFormat';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    newsButton: { insertNewsButton: () => ReturnType };
    newsImage: { insertNewsImage: (attrs: { src: string; alt?: string }) => ReturnType };
  }
}

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/** Возвращает текст ошибки или null, если файл подходит для новостей. */
export const checkNewsImage = (file: File): string | null => {
  if (!IMAGE_TYPES.includes(file.type)) return 'Подходят только JPG, PNG и WebP.';
  if (file.size > MAX_IMAGE_BYTES) return 'Файл больше 10 МБ. Сожмите фото и попробуйте ещё раз.';
  return null;
};

export const uploadErrorText = (error: any): string =>
  error?.response?.data?.message || 'Не удалось загрузить фото. Попробуйте ещё раз.';

// ---------- блок «Кнопка» ----------

const ButtonView: React.FC<NodeViewProps> = ({ node, updateAttributes, selected }) => (
  <NodeViewWrapper className={`news-nv-button${selected ? ' is-selected' : ''}`} data-drag-handle>
    <div contentEditable={false}>
      <span className="news-button">{node.attrs.text || 'Кнопка'}</span>
      {selected && (
        <div className="news-nv-fields">
          <label>
            <span>Текст кнопки</span>
            <input
              type="text"
              value={node.attrs.text}
              maxLength={60}
              onChange={(e) => updateAttributes({ text: e.target.value })}
            />
          </label>
          <label>
            <span>Ссылка (например /Hotel или https://…)</span>
            <input
              type="text"
              value={node.attrs.href}
              maxLength={500}
              onChange={(e) => updateAttributes({ href: e.target.value })}
            />
          </label>
        </div>
      )}
      {!selected && <span className="news-nv-hint">Блок «Кнопка» · {node.attrs.href} · нажмите, чтобы изменить</span>}
    </div>
  </NodeViewWrapper>
);

export const NewsButton = Node.create({
  name: 'newsButton',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return { text: { default: 'Подробнее' }, href: { default: '/Hotel' } };
  },

  parseHTML() {
    return [{
      tag: 'div.news-button-wrap',
      getAttrs: (el) => {
        const link = (el as HTMLElement).querySelector('a');
        return { text: link?.textContent || 'Подробнее', href: link?.getAttribute('href') || '#' };
      },
    }];
  },

  renderHTML({ node }) {
    return ['div', { class: 'news-button-wrap' }, ['a', { class: 'news-button', href: node.attrs.href }, node.attrs.text]];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ButtonView);
  },

  addCommands() {
    return {
      insertNewsButton: () => ({ commands }) =>
        commands.insertContent([{ type: this.name, attrs: {} }, { type: 'paragraph' }]),
    };
  },
});

// ---------- фото с подписью ----------

const ImageView: React.FC<NodeViewProps> = ({ node, updateAttributes, deleteNode, selected }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const replace = async (file?: File) => {
    if (!file) return;
    const problem = checkNewsImage(file);
    if (problem) { setError(problem); return; }
    setBusy(true);
    setError('');
    try {
      updateAttributes({ src: await uploadNewsImage(file) });
    } catch (e: any) {
      setError(uploadErrorText(e));
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <NodeViewWrapper as="figure" className={`news-figure news-nv-figure${selected ? ' is-selected' : ''}`}>
      <div className="news-nv-media" contentEditable={false} data-drag-handle>
        <img src={mediaSrc(node.attrs.src)} alt={node.attrs.alt || ''} draggable={false} />
        <div className="news-nv-tools">
          <button type="button" disabled={busy} onClick={() => fileRef.current?.click()}>{busy ? 'Загрузка…' : 'Заменить'}</button>
          <button type="button" onClick={() => deleteNode()}>Убрать</button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          onChange={(e) => replace(e.target.files?.[0])}
        />
      </div>
      <NodeViewContent as="figcaption" className="news-nv-caption" data-empty={node.content.size === 0 ? 'true' : 'false'} />
      {error && <div className="news-nv-error" contentEditable={false} role="alert">{error}</div>}
      {selected && (
        <label className="news-nv-alt" contentEditable={false}>
          <span>Описание фото для незрячих читателей</span>
          <input type="text" value={node.attrs.alt} maxLength={255} onChange={(e) => updateAttributes({ alt: e.target.value })} />
        </label>
      )}
    </NodeViewWrapper>
  );
};

export const NewsImage = Node.create({
  name: 'newsImage',
  group: 'block',
  content: 'inline*',
  marks: '',
  isolating: true,
  draggable: true,

  addAttributes() {
    return { src: { default: '' }, alt: { default: '' } };
  },

  parseHTML() {
    return [{
      tag: 'figure.news-figure',
      contentElement: 'figcaption',
      getAttrs: (el) => {
        const img = (el as HTMLElement).querySelector('img');
        return { src: img?.getAttribute('src') || '', alt: img?.getAttribute('alt') || '' };
      },
    }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'figure',
      mergeAttributes({ class: 'news-figure' }),
      ['img', { src: node.attrs.src, alt: node.attrs.alt }],
      ['figcaption', 0],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageView);
  },

  addCommands() {
    return {
      insertNewsImage: (attrs) => ({ commands }) =>
        commands.insertContent([{ type: this.name, attrs: { src: attrs.src, alt: attrs.alt || '' } }, { type: 'paragraph' }]),
    };
  },

  addKeyboardShortcuts() {
    return {
      // Enter в подписи не раскалывает фото, а переходит к следующему абзацу.
      Enter: ({ editor }) => {
        const { $from } = editor.state.selection;
        if ($from.parent.type.name !== this.name) return false;
        const after = $from.after();
        return editor.chain().insertContentAt(after, { type: 'paragraph' }).focus(after + 1).run();
      },
    };
  },
});
