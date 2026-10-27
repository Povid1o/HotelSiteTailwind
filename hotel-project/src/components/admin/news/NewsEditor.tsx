import React, { useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import type { Editor, JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { NewsButton, NewsImage, checkNewsImage, uploadErrorText } from './newsExtensions';
import { uploadNewsImage } from '../../http/newsAPI';

export interface EditorChange {
  json: JSONContent;
  html: string;
  words: number;
}

interface Props {
  content: JSONContent | null;
  onChange: (change: EditorChange) => void;
}

const countWords = (text: string) => {
  const t = text.replace(/\s+/g, ' ').trim();
  return t ? t.split(' ').length : 0;
};

export const readingMinutes = (words: number) => Math.max(1, Math.ceil(words / 180));

const wordsLabel = (n: number) => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  const word = mod10 === 1 && mod100 !== 11 ? 'слово' : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? 'слова' : 'слов';
  return `${n} ${word}`;
};

/** Ссылка из поля ввода: адрес сайта, почта, телефон, якорь или внутренний путь. */
const normalizeHref = (value: string) => {
  const v = value.trim();
  if (!v) return '';
  if (/^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(v)) return v;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return `mailto:${v}`;
  if (/^\+?[\d\s()-]{6,}$/.test(v)) return `tel:${v.replace(/[\s()-]/g, '')}`;
  return `https://${v}`;
};

const HEADINGS: { label: string; level: 0 | 2 | 3 | 4; cls: string }[] = [
  { label: 'Абзац', level: 0, cls: 'is-p' },
  { label: 'Заголовок 2', level: 2, cls: 'is-h2' },
  { label: 'Заголовок 3', level: 3, cls: 'is-h3' },
  { label: 'Заголовок 4', level: 4, cls: 'is-h4' },
];

const keepFocus = (e: React.MouseEvent) => e.preventDefault();

const Sep = () => <span className="adm-tb-sep" aria-hidden="true" />;

const Toolbar: React.FC<{ editor: Editor }> = ({ editor }) => {
  const [headingOpen, setHeadingOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkValue, setLinkValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headingOpen) return;
    const close = (e: MouseEvent) => {
      if (headingRef.current && !headingRef.current.contains(e.target as globalThis.Node)) setHeadingOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [headingOpen]);

  const currentHeading = HEADINGS.find((h) => h.level && editor.isActive('heading', { level: h.level })) || HEADINGS[0];

  const setHeading = (level: 0 | 2 | 3 | 4) => {
    const chain = editor.chain().focus();
    if (level === 0) chain.setParagraph().run();
    else chain.setHeading({ level }).run();
    setHeadingOpen(false);
  };

  const openLink = () => {
    setLinkValue((editor.getAttributes('link').href as string) || '');
    setLinkOpen(true);
  };

  const applyLink = (e: React.FormEvent) => {
    e.preventDefault();
    const href = normalizeHref(linkValue);
    const chain = editor.chain().focus().extendMarkRange('link');
    if (!href) chain.unsetLink().run();
    else chain.setLink({ href }).run();
    setLinkOpen(false);
  };

  const removeLink = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setLinkOpen(false);
  };

  const addPhoto = async (file?: File) => {
    if (!file) return;
    const problem = checkNewsImage(file);
    if (problem) { setError(problem); return; }
    setBusy(true);
    setError('');
    try {
      const src = await uploadNewsImage(file);
      editor.chain().focus().insertNewsImage({ src }).run();
    } catch (e: any) {
      setError(uploadErrorText(e));
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const btn = (active: boolean, label: string, onClick: () => void, content: React.ReactNode, cls = '') => (
    <button
      type="button"
      className={`adm-tb ${cls}${active ? ' is-active' : ''}`}
      aria-label={label}
      title={label}
      aria-pressed={active}
      onMouseDown={keepFocus}
      onClick={onClick}
    >
      {content}
    </button>
  );

  return (
    <div className="adm-toolbar-wrap">
      <div role="toolbar" aria-label="Форматирование текста" className="adm-toolbar">
        {btn(false, 'Отменить', () => editor.chain().focus().undo().run(), '↶', 'is-icon')}
        {btn(false, 'Повторить', () => editor.chain().focus().redo().run(), '↷', 'is-icon')}
        <Sep />

        <div className="adm-tb-menu" ref={headingRef}>
          <button
            type="button"
            className="adm-tb is-wide"
            aria-haspopup="menu"
            aria-expanded={headingOpen}
            onMouseDown={keepFocus}
            onClick={() => setHeadingOpen((v) => !v)}
          >
            {currentHeading.label} <span aria-hidden="true" className="adm-tb-caret">▾</span>
          </button>
          {headingOpen && (
            <div role="menu" className="adm-tb-popup">
              {HEADINGS.map((h) => (
                <button key={h.level} role="menuitem" type="button" className={`adm-tb-item ${h.cls}`} onMouseDown={keepFocus} onClick={() => setHeading(h.level)}>
                  {h.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {btn(editor.isActive('bulletList'), 'Маркированный список', () => editor.chain().focus().toggleBulletList().run(), '• Список', 'is-wide')}
        {btn(editor.isActive('orderedList'), 'Нумерованный список', () => editor.chain().focus().toggleOrderedList().run(), '1. Список', 'is-wide')}
        <Sep />
        {btn(editor.isActive('blockquote'), 'Цитата', () => editor.chain().focus().toggleBlockquote().run(), '“', 'is-icon is-serif')}
        <Sep />
        {btn(editor.isActive('bold'), 'Жирный', () => editor.chain().focus().toggleBold().run(), 'B', 'is-icon is-bold')}
        {btn(editor.isActive('italic'), 'Курсив', () => editor.chain().focus().toggleItalic().run(), 'I', 'is-icon is-italic')}
        {btn(editor.isActive('underline'), 'Подчёркнутый', () => editor.chain().focus().toggleUnderline().run(), 'U', 'is-icon is-underline')}
        {btn(editor.isActive('strike'), 'Зачёркнутый', () => editor.chain().focus().toggleStrike().run(), 'S', 'is-icon is-strike')}
        <Sep />
        {btn(editor.isActive('link'), 'Ссылка', openLink, 'Ссылка', 'is-wide')}
        <Sep />
        {btn(false, 'Вставить линию', () => editor.chain().focus().setHorizontalRule().run(), '+ Линия', 'is-wide is-insert')}
        <button
          type="button"
          className="adm-tb is-wide is-insert"
          disabled={busy}
          onMouseDown={keepFocus}
          onClick={() => fileRef.current?.click()}
        >
          {busy ? 'Загрузка…' : '+ Фото'}
        </button>
        {btn(false, 'Вставить кнопку', () => editor.chain().focus().insertNewsButton().run(), '+ Кнопка', 'is-wide is-insert')}
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => addPhoto(e.target.files?.[0])} />
      </div>

      {linkOpen && (
        <form className="adm-linkbar" onSubmit={applyLink}>
          <label htmlFor="news-link-input">Адрес ссылки</label>
          <input
            id="news-link-input"
            type="text"
            autoFocus
            value={linkValue}
            placeholder="https://… или /Hotel"
            onChange={(e) => setLinkValue(e.target.value)}
          />
          <button type="submit" className="adm-btn adm-btn-primary adm-btn-sm">Готово</button>
          {editor.isActive('link') && <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={removeLink}>Убрать</button>}
          <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setLinkOpen(false)}>Отмена</button>
        </form>
      )}
      {error && <div className="adm-editor-error" role="alert">{error}</div>}
    </div>
  );
};

const NewsEditor: React.FC<Props> = ({ content, onChange }) => {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const [words, setWords] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] }, code: false, codeBlock: false }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: {} }),
      Placeholder.configure({
        placeholder: ({ node }) => (node.type.name === 'heading' ? 'Заголовок раздела' : 'Начните писать новость…'),
      }),
      NewsButton,
      NewsImage,
    ],
    content: content && Object.keys(content).length ? content : '',
    editorProps: {
      attributes: { class: 'news-prose adm-editor-doc', role: 'textbox', 'aria-multiline': 'true', 'aria-label': 'Текст новости' },
    },
    onCreate: ({ editor: ed }) => setWords(countWords(ed.getText())),
    onUpdate: ({ editor: ed }) => {
      const w = countWords(ed.getText());
      setWords(w);
      onChangeRef.current({ json: ed.getJSON(), html: ed.getHTML(), words: w });
    },
  });

  if (!editor) return <div className="adm-editor adm-editor-loading">Загружаем редактор…</div>;

  return (
    <div className="adm-editor">
      <Toolbar editor={editor} />
      <div className="adm-editor-page">
        <EditorContent editor={editor} />
      </div>
      <div className="adm-editor-foot">
        <span>{wordsLabel(words)} · чтение около {readingMinutes(words)} мин</span>
        <span>Заголовок новости задаётся выше, в тексте — только уровни 2–4</span>
      </div>
    </div>
  );
};

export default NewsEditor;
