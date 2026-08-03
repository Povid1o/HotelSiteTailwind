import React, { ChangeEvent, useEffect, useState } from 'react';
import EditableImageSlot, { EditableImageValue } from '../editable/EditableImageSlot';
import '../styles/v4-pages.css';

export interface V4HeroContent {
  title: string;
  description: string;
  image: EditableImageValue;
}

interface V4HeroEditProps {
  pageTitle: string;
  content: Record<string, unknown>;
  onSave: (section: string, value: V4HeroContent) => void | Promise<void>;
  section?: string;
  imageLabel?: string;
}

const emptyHero = (title: string): V4HeroContent => ({ title, description: '', image: null });
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const toImageValue = (value: unknown): EditableImageValue => typeof value === 'string' || value instanceof File ? value : null;

const readHero = (content: Record<string, unknown>, section: string, pageTitle: string): V4HeroContent => {
  const source = content[section];
  if (!isRecord(source)) return emptyHero(pageTitle);
  return {
    title: typeof source.title === 'string' ? source.title : pageTitle,
    description: typeof source.description === 'string' ? source.description : '',
    image: toImageValue(source.image),
  };
};

/** Shared editor for V4 dynamic-list pages: only their hero belongs to page content. */
const V4HeroEdit: React.FC<V4HeroEditProps> = ({ pageTitle, content, onSave, section = 'hero', imageLabel = 'Фото хедера' }) => {
  const [draft, setDraft] = useState<V4HeroContent>(() => readHero(content, section, pageTitle));
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setDraft(readHero(content, section, pageTitle));
    setDirty(false);
  }, [content, pageTitle, section]);

  const change = <K extends keyof V4HeroContent>(key: K, value: V4HeroContent[K]) => {
    setDraft(previous => ({ ...previous, [key]: value }));
    setDirty(true);
  };
  const changeText = (key: 'title' | 'description') => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => change(key, event.target.value);
  const save = async () => { await onSave(section, draft); setDirty(false); };

  return <div className='space-y-6 p-4 md:p-6'>
    <div><h2 className='font-display text-4xl text-ink'>{pageTitle}</h2><p className='mt-2 text-sm text-gray-600'>Редактируется только header: фотография, заголовок и краткая подпись. Карточки ниже управляются в соответствующих разделах админки.</p></div>
    <section className='overflow-hidden rounded-lg border border-[#19312f]/15 bg-[#f5f2ea]'>
      <div className='v4-page !pt-0'><div className='v4-page__hero !h-[280px] !min-h-0'>
        <EditableImageSlot value={draft.image} onChange={value => change('image', value)} label={imageLabel} alt={draft.title} className='absolute inset-0 !min-h-0 !rounded-none !border-0' />
        <div className='absolute inset-0 bg-gradient-to-b from-[#19312f]/10 to-[#19312f]/60' />
        <div className='bottom-0 box-border w-full px-6 pb-7 text-[#f5f2ea] absolute'><h1 className='!text-4xl'>{draft.title || pageTitle}</h1><p className='mt-2 max-w-xl text-sm text-[#f5f2ea]/85'>{draft.description || 'Добавьте краткое описание страницы.'}</p></div>
      </div></div>
    </section>
    <div className='grid gap-4 md:grid-cols-2'><label className='block text-sm font-semibold text-gray-700'>Заголовок<input className='mt-1 block w-full rounded border-gray-300' value={draft.title} onChange={changeText('title')} /></label><label className='block text-sm font-semibold text-gray-700'>Подзаголовок<textarea className='mt-1 block w-full rounded border-gray-300' rows={3} value={draft.description} onChange={changeText('description')} /></label></div>
    <div className='flex justify-end'><button type='button' disabled={!dirty} onClick={() => void save()} className='rounded bg-main_theme px-4 py-2 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50'>Сохранить header</button></div>
  </div>;
};

export default V4HeroEdit;
