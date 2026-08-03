import React, { useEffect, useState } from 'react';

type ContactContent = {
  eyebrow: string;
  title: string;
  address: string;
  phone: string;
  phoneHref: string;
  email: string;
  reception: string;
};

type PrivacySection = { title: string; text: string };

const contactDefault: ContactContent = {
  eyebrow: 'Контакты', title: 'Будем рады видеть вас на террасах',
  address: 'Абрау-Дюрсо, Краснодарский край', phone: '+7 (861) 200-00-00',
  phoneHref: '+78612000000', email: 'info@vineterraces.ru', reception: 'Ежедневно, 08:00 — 22:00'
};
const privacyDefault = [
  { title: '1. Какие данные мы собираем', text: 'Имя, телефон и почту — при бронировании номера, дегустации или места на мероприятии.' },
  { title: '2. Как мы их используем', text: 'Только для подтверждения брони и связи с вами по поводу вашего визита.' },
  { title: '3. Хранение', text: 'Данные хранятся не дольше срока, необходимого для оказания услуги.' },
  { title: '4. Ваши права', text: 'Вы можете запросить, изменить или удалить свои данные, написав нам на почту.' }
];

interface Props {
  type: 'contacts' | 'privacy';
  content: any;
  onSave: (section: string, value: any) => void | Promise<void>;
}

/** Небольшой редактор для V4-страниц, сохраняющий данные одной атомарной секцией. */
const V4InfoPageEdit: React.FC<Props> = ({ type, content, onSave }) => {
  const [draft, setDraft] = useState<any>({});
  const [dirty, setDirty] = useState(false);
  const section = type === 'contacts' ? 'contacts' : 'privacy';

  useEffect(() => {
    const defaults = type === 'contacts'
      ? contactDefault
      : { eyebrow: 'Документы', title: 'Политика конфиденциальности', sections: privacyDefault };
    setDraft({ ...defaults, ...(content?.[section] || {}) });
    setDirty(false);
  }, [content, section, type]);

  const change = (key: string, value: any) => { setDraft((previous: any) => ({ ...previous, [key]: value })); setDirty(true); };
  const save = () => { onSave(section, draft); setDirty(false); };

  if (type === 'contacts') return <div className='space-y-4 p-4 md:p-6'>
    <h2 className='font-display text-4xl text-ink'>Контакты</h2>
    <p className='text-sm text-gray-600'>Карта берётся из одного реального блока сайта и не дублируется в базе. Здесь редактируются только подписи и контактные данные.</p>
    {[
      ['eyebrow', 'Надзаголовок'], ['title', 'Заголовок'], ['address', 'Адрес'], ['phone', 'Телефон'], ['phoneHref', 'Телефон для ссылки (только цифры и +)'], ['email', 'Почта'], ['reception', 'Режим работы']
    ].map(([key, label]) => <label className='block text-sm font-semibold text-gray-700' key={key}>{label}<input className='mt-1 block w-full rounded border-gray-300' value={draft[key] || ''} onChange={event => change(key, event.target.value)} /></label>)}
    <button type='button' disabled={!dirty} onClick={save} className='rounded bg-main_theme px-4 py-2 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50'>Сохранить контакты</button>
  </div>;

  const sections: PrivacySection[] = Array.isArray(draft.sections) ? draft.sections : privacyDefault;
  const setSection = (index: number, key: keyof PrivacySection, value: string) => {
    const updated = sections.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item);
    change('sections', updated);
  };
  return <div className='space-y-5 p-4 md:p-6'>
    <h2 className='font-display text-4xl text-ink'>Политика конфиденциальности</h2>
    <label className='block text-sm font-semibold text-gray-700'>Надзаголовок<input className='mt-1 block w-full rounded border-gray-300' value={draft.eyebrow || ''} onChange={event => change('eyebrow', event.target.value)} /></label>
    <label className='block text-sm font-semibold text-gray-700'>Заголовок<input className='mt-1 block w-full rounded border-gray-300' value={draft.title || ''} onChange={event => change('title', event.target.value)} /></label>
    {sections.map((item, index) => <fieldset className='space-y-2 border-t border-gray-200 pt-4' key={index}>
      <label className='block text-sm font-semibold text-gray-700'>Заголовок раздела<input className='mt-1 block w-full rounded border-gray-300' value={item.title} onChange={event => setSection(index, 'title', event.target.value)} /></label>
      <label className='block text-sm font-semibold text-gray-700'>Текст<textarea className='mt-1 block w-full rounded border-gray-300' rows={3} value={item.text} onChange={event => setSection(index, 'text', event.target.value)} /></label>
    </fieldset>)}
    <button type='button' disabled={!dirty} onClick={save} className='rounded bg-main_theme px-4 py-2 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50'>Сохранить документ</button>
  </div>;
};

export default V4InfoPageEdit;
