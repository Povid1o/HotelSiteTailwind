import React, { ChangeEvent, useEffect, useState } from 'react';
import EditableImageSlot, { EditableImageValue } from '../editable/EditableImageSlot';
import '../styles/home-v3.css';

export interface GalleryImage { src: EditableImageValue; alt: string; }
export interface HomePageData {
  mainBackground: { title: string; description: string; image: EditableImageValue };
  aboutSection: { title: string; description: string };
  firstGallery: { title: string; images: GalleryImage[] };
  secondGallery: { title: string; images: GalleryImage[] };
}

interface HomeEditProps {
  pageData: HomePageData;
  onContentChange: (section: keyof HomePageData, value: HomePageData[keyof HomePageData]) => void | Promise<void>;
}

const ensureImage = (value: EditableImageValue | GalleryImage): GalleryImage => typeof value === 'object' && value !== null && !(value instanceof File) && 'src' in value ? value : { src: value as EditableImageValue, alt: '' };
const normalizeData = (data: HomePageData): HomePageData => ({
  mainBackground: { title: '', description: '', image: null, ...data.mainBackground },
  aboutSection: { title: '', description: '', ...data.aboutSection },
  firstGallery: { title: '', images: (data.firstGallery.images || []).map(ensureImage), ...data.firstGallery },
  secondGallery: { title: '', images: (data.secondGallery.images || []).map(ensureImage), ...data.secondGallery },
});

const GalleryEditor: React.FC<{ label: string; images: GalleryImage[]; onChange: (images: GalleryImage[]) => void }> = ({ label, images, onChange }) => {
  const update = (index: number, src: File | null) => onChange(images.map((image, imageIndex) => imageIndex === index ? { ...image, src } : image));
  const remove = (index: number) => onChange(images.filter((_, imageIndex) => imageIndex !== index));
  return <div className='grid gap-3 sm:grid-cols-2'>
    {images.map((image, index) => <div className='relative' key={`${image.alt}-${index}`}><EditableImageSlot value={image.src} label={`${label} ${index + 1}`} alt={image.alt} onChange={value => value ? update(index, value) : remove(index)} /><button className='absolute right-2 top-2 rounded-full bg-[#19312f] px-2 py-1 text-xs text-white' type='button' onClick={() => remove(index)}>Удалить</button></div>)}
    <EditableImageSlot value={null} label={`Добавить: ${label}`} onChange={value => value && onChange([...images, { src: value, alt: `${label} ${images.length + 1}` }])} />
  </div>;
};

const HomeEdit: React.FC<HomeEditProps> = ({ pageData, onContentChange }) => {
  const [draft, setDraft] = useState<HomePageData>(() => normalizeData(pageData));
  const [dirtySections, setDirtySections] = useState<Set<keyof HomePageData>>(new Set());

  useEffect(() => { setDraft(normalizeData(pageData)); setDirtySections(new Set()); }, [pageData]);
  const patch = <K extends keyof HomePageData>(section: K, value: HomePageData[K]) => { setDraft(previous => ({ ...previous, [section]: value })); setDirtySections(previous => new Set(previous).add(section)); };
  const text = <K extends keyof HomePageData, F extends keyof HomePageData[K]>(section: K, field: F) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => patch(section, { ...draft[section], [field]: event.target.value } as HomePageData[K]);
  const save = async (section: keyof HomePageData) => { await onContentChange(section, draft[section]); setDirtySections(previous => { const next = new Set(previous); next.delete(section); return next; }); };

  return <div className='space-y-10 p-4 md:p-6'>
    <div><h2 className='font-display text-4xl text-ink'>Главная</h2><p className='mt-2 text-sm text-gray-600'>Предпросмотр повторяет V4-композицию. Изменения видны сразу и сохраняются по секциям.</p></div>
    <section className='overflow-hidden rounded-lg border border-[#19312f]/15'><div className='v4-home'><div className='v4-home__hero !h-[420px] !min-h-0'><EditableImageSlot value={draft.mainBackground.image} label='Фото хедера' alt={draft.mainBackground.title} onChange={image => patch('mainBackground', { ...draft.mainBackground, image })} className='absolute inset-0 !min-h-0 !rounded-none !border-0' /><div className='absolute inset-0 bg-gradient-to-b from-[#19312f]/10 to-[#19312f]/75' /><div className='v4-container v4-home__hero-content !pb-10'><p className='v4-kicker v4-kicker--light'>Абрау-Дюрсо</p><h1 className='!text-5xl'>{draft.mainBackground.title || 'Заголовок главной'}</h1><p className='v4-home__lead'>{draft.mainBackground.description || 'Добавьте описание главной страницы.'}</p></div></div></div></section>
    <section className='space-y-3'><h3 className='font-display text-3xl text-ink'>Hero</h3><label className='block text-sm font-semibold text-gray-700'>Заголовок<input className='mt-1 block w-full rounded border-gray-300' value={draft.mainBackground.title} onChange={text('mainBackground', 'title')} /></label><label className='block text-sm font-semibold text-gray-700'>Описание<textarea className='mt-1 block w-full rounded border-gray-300' rows={3} value={draft.mainBackground.description} onChange={text('mainBackground', 'description')} /></label><button type='button' disabled={!dirtySections.has('mainBackground')} onClick={() => void save('mainBackground')} className='rounded bg-main_theme px-4 py-2 font-bold text-white disabled:opacity-50'>Сохранить hero</button></section>
    <section className='space-y-3 border-t border-gray-200 pt-8'><div className='grid gap-6 md:grid-cols-2'><div><p className='v4-kicker'>Почему остаться</p><h2 className='font-display text-4xl text-ink'>{draft.aboutSection.title || 'Заголовок блока'}</h2><p className='mt-3 text-[#19312f]/75'>{draft.aboutSection.description || 'Добавьте описание.'}</p></div><GalleryEditor label='Фото блока «Почему остаться»' images={draft.firstGallery.images} onChange={images => patch('firstGallery', { ...draft.firstGallery, images })} /></div><label className='block text-sm font-semibold text-gray-700'>Заголовок<input className='mt-1 block w-full rounded border-gray-300' value={draft.aboutSection.title} onChange={text('aboutSection', 'title')} /></label><label className='block text-sm font-semibold text-gray-700'>Описание<textarea className='mt-1 block w-full rounded border-gray-300' rows={4} value={draft.aboutSection.description} onChange={text('aboutSection', 'description')} /></label><div className='flex flex-wrap gap-3'><button type='button' disabled={!dirtySections.has('aboutSection')} onClick={() => void save('aboutSection')} className='rounded bg-main_theme px-4 py-2 font-bold text-white disabled:opacity-50'>Сохранить текст</button><button type='button' disabled={!dirtySections.has('firstGallery')} onClick={() => void save('firstGallery')} className='rounded border border-[#19312f]/20 px-4 py-2 font-bold text-[#19312f] disabled:opacity-50'>Сохранить фото</button></div></section>
    <section className='space-y-3 border-t border-gray-200 pt-8'><p className='v4-kicker'>Винодельня</p><h2 className='font-display text-4xl text-ink'>{draft.secondGallery.title || 'Фото винодельни'}</h2><GalleryEditor label='Фото винодельни' images={draft.secondGallery.images} onChange={images => patch('secondGallery', { ...draft.secondGallery, images })} /><label className='block text-sm font-semibold text-gray-700'>Заголовок блока<input className='mt-1 block w-full rounded border-gray-300' value={draft.secondGallery.title} onChange={text('secondGallery', 'title')} /></label><button type='button' disabled={!dirtySections.has('secondGallery')} onClick={() => void save('secondGallery')} className='rounded bg-main_theme px-4 py-2 font-bold text-white disabled:opacity-50'>Сохранить блок винодельни</button></section>
  </div>;
};

export default HomeEdit;
