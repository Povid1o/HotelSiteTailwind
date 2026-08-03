import React, { ChangeEvent, useEffect, useState } from 'react';
import '../styles/v4-extra.css';

export interface ContactContent { eyebrow: string; title: string; address: string; phone: string; phoneHref: string; email: string; reception: string; }
export interface PrivacySection { title: string; text: string; }
export interface PrivacyContent { eyebrow: string; title: string; sections: PrivacySection[]; }

interface V4InfoPageEditProps { type: 'contacts' | 'privacy'; content: Record<string, unknown>; onSave: (section: string, value: ContactContent | PrivacyContent) => void | Promise<void>; }

const contactDefault: ContactContent = { eyebrow: 'Контакты', title: 'Будем рады видеть вас на террасах', address: 'Абрау-Дюрсо, Краснодарский край', phone: '+7 (861) 200-00-00', phoneHref: '+78612000000', email: 'info@vineterraces.ru', reception: 'Ежедневно, 08:00 — 22:00' };
const privacyDefault: PrivacyContent = { eyebrow: 'Документы', title: 'Политика конфиденциальности', sections: [{ title: '1. Какие данные мы собираем', text: 'Имя, телефон и почту — при бронировании номера, дегустации или места на мероприятии.' }, { title: '2. Как мы их используем', text: 'Только для подтверждения брони и связи с вами по поводу вашего визита.' }, { title: '3. Хранение', text: 'Данные хранятся не дольше срока, необходимого для оказания услуги.' }, { title: '4. Ваши права', text: 'Вы можете запросить, изменить или удалить свои данные, написав нам на почту.' }] };
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const readString = (record: Record<string, unknown>, key: string, fallback: string) => typeof record[key] === 'string' ? record[key] : fallback;
const readPrivacySections = (value: unknown): PrivacySection[] => Array.isArray(value) ? value.filter(isRecord).map((section, index) => ({ title: readString(section, 'title', `Раздел ${index + 1}`), text: readString(section, 'text', '') })) : privacyDefault.sections;

const V4InfoPageEdit: React.FC<V4InfoPageEditProps> = ({ type, content, onSave }) => {
  const sectionName = type === 'contacts' ? 'contacts' : 'privacy';
  const [draft, setDraft] = useState<ContactContent | PrivacyContent>(contactDefault);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const source = isRecord(content[sectionName]) ? content[sectionName] : {};
    setDraft(type === 'contacts' ? { ...contactDefault, ...Object.fromEntries(Object.entries(contactDefault).map(([key, fallback]) => [key, readString(source, key, fallback)])) } : { eyebrow: readString(source, 'eyebrow', privacyDefault.eyebrow), title: readString(source, 'title', privacyDefault.title), sections: readPrivacySections(source.sections) });
    setDirty(false);
  }, [content, sectionName, type]);

  const updateContact = (key: keyof ContactContent) => (event: ChangeEvent<HTMLInputElement>) => { setDraft(previous => ({ ...(previous as ContactContent), [key]: event.target.value })); setDirty(true); };
  const updatePrivacy = (key: 'eyebrow' | 'title') => (event: ChangeEvent<HTMLInputElement>) => { setDraft(previous => ({ ...(previous as PrivacyContent), [key]: event.target.value })); setDirty(true); };
  const updatePrivacySection = (index: number, key: keyof PrivacySection) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setDraft(previous => { const privacy = previous as PrivacyContent; return { ...privacy, sections: privacy.sections.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: event.target.value } : item) }; }); setDirty(true); };
  const save = async () => { await onSave(sectionName, draft); setDirty(false); };

  if (type === 'contacts') {
    const contact = draft as ContactContent;
    const fields: Array<[keyof ContactContent, string]> = [['eyebrow', 'Надзаголовок'], ['title', 'Заголовок'], ['address', 'Адрес'], ['phone', 'Телефон'], ['phoneHref', 'Телефон для ссылки'], ['email', 'Почта'], ['reception', 'Режим работы']];
    return <div className='space-y-6 p-4 md:p-6'><div><h2 className='font-display text-4xl text-ink'>Контакты</h2><p className='mt-2 text-sm text-gray-600'>Редактор и предпросмотр используют ту же V4-разметку, что и публичная страница.</p></div><section className='overflow-hidden rounded-lg border border-[#19312f]/15 bg-[#f5f2ea]'><div className='v4-info !grid-cols-1 !gap-0 !px-6 !py-8'><div><p className='v4-kicker'>{contact.eyebrow}</p><h1>{contact.title}</h1><div className='v4-info__details'><div><b>Адрес</b><p>{contact.address}</p></div><div><b>Телефон</b><p>{contact.phone}</p></div><div><b>Почта</b><p>{contact.email}</p></div><div><b>Ресепшн</b><p>{contact.reception}</p></div></div></div></div></section><div className='grid gap-4 md:grid-cols-2'>{fields.map(([key, label]) => <label className='block text-sm font-semibold text-gray-700' key={key}>{label}<input className='mt-1 block w-full rounded border-gray-300' value={contact[key]} onChange={updateContact(key)} /></label>)}</div><button type='button' disabled={!dirty} onClick={() => void save()} className='rounded bg-main_theme px-4 py-2 font-bold text-white disabled:opacity-50'>Сохранить контакты</button></div>;
  }

  const privacy = draft as PrivacyContent;
  return <div className='space-y-6 p-4 md:p-6'><div><h2 className='font-display text-4xl text-ink'>Политика конфиденциальности</h2><p className='mt-2 text-sm text-gray-600'>Текст сразу отображается в V4-предпросмотре.</p></div><section className='overflow-hidden rounded-lg border border-[#19312f]/15 bg-[#f5f2ea]'><div className='v4-privacy !px-6 !py-8'><p className='v4-kicker'>{privacy.eyebrow}</p><h1>{privacy.title}</h1>{privacy.sections.map(item => <div key={item.title}><h3>{item.title}</h3><p>{item.text}</p></div>)}</div></section><div className='grid gap-4 md:grid-cols-2'><label className='block text-sm font-semibold text-gray-700'>Надзаголовок<input className='mt-1 block w-full rounded border-gray-300' value={privacy.eyebrow} onChange={updatePrivacy('eyebrow')} /></label><label className='block text-sm font-semibold text-gray-700'>Заголовок<input className='mt-1 block w-full rounded border-gray-300' value={privacy.title} onChange={updatePrivacy('title')} /></label></div>{privacy.sections.map((item, index) => <fieldset className='space-y-2 border-t border-gray-200 pt-4' key={`${item.title}-${index}`}><label className='block text-sm font-semibold text-gray-700'>Заголовок раздела<input className='mt-1 block w-full rounded border-gray-300' value={item.title} onChange={updatePrivacySection(index, 'title')} /></label><label className='block text-sm font-semibold text-gray-700'>Текст<textarea className='mt-1 block w-full rounded border-gray-300' rows={3} value={item.text} onChange={updatePrivacySection(index, 'text')} /></label></fieldset>)}<button type='button' disabled={!dirty} onClick={() => void save()} className='rounded bg-main_theme px-4 py-2 font-bold text-white disabled:opacity-50'>Сохранить документ</button></div>;
};

export default V4InfoPageEdit;
