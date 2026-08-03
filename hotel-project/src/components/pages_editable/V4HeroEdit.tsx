import React, { useEffect, useState } from 'react';

interface Props {
  pageTitle: string;
  content: any;
  onSave: (section: string, value: any) => void | Promise<void>;
}

const V4HeroEdit: React.FC<Props> = ({ pageTitle, content, onSave }) => {
  const [draft, setDraft] = useState<any>({ title: pageTitle, description: '', image: '' });
  const [dirty, setDirty] = useState(false);
  useEffect(() => { setDraft({ title: pageTitle, description: '', image: '', ...(content?.hero || {}) }); setDirty(false); }, [content, pageTitle]);
  const set = (key: string, value: any) => { setDraft((valueBefore: any) => ({ ...valueBefore, [key]: value })); setDirty(true); };
  return <div className='space-y-4 p-4 md:p-6'>
    <h2 className='font-display text-4xl text-ink'>{pageTitle}</h2>
    <p className='text-sm text-gray-600'>Hero-блок новой страницы: заголовок, подзаголовок и изображение. Файл загрузится в медиахранилище только после сохранения.</p>
    <label className='block text-sm font-semibold text-gray-700'>Заголовок<input className='mt-1 block w-full rounded border-gray-300' value={draft.title || ''} onChange={event => set('title', event.target.value)} /></label>
    <label className='block text-sm font-semibold text-gray-700'>Подзаголовок<textarea className='mt-1 block w-full rounded border-gray-300' rows={3} value={draft.description || ''} onChange={event => set('description', event.target.value)} /></label>
    <label className='block text-sm font-semibold text-gray-700'>Изображение hero<input className='mt-1 block w-full text-sm' type='file' accept='image/jpeg,image/png,image/webp' onChange={event => event.target.files?.[0] && set('image', event.target.files[0])} /></label>
    {typeof draft.image === 'string' && draft.image && <p className='break-all text-xs text-gray-500'>Текущий файл: {draft.image}</p>}
    <button type='button' disabled={!dirty} onClick={() => { onSave('hero', draft); setDirty(false); }} className='rounded bg-main_theme px-4 py-2 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50'>Сохранить hero</button>
  </div>;
};

export default V4HeroEdit;
