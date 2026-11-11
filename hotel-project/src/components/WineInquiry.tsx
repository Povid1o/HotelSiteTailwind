import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { submitWineInquiry } from './http/wineInquiryAPI';
import './styles/wine-inquiry.css';

interface InquiryWine { id: number; name: string; year?: number }

const InquiryDialog = ({ wine, onClose }: { wine: InquiryWine; onClose: () => void }) => {
  const titleId = useId();
  const emailId = useId();
  const noteId = useId();
  const panel = useRef<HTMLElement>(null);
  const emailInput = useRef<HTMLInputElement>(null);
  const busy = useRef(false);
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    emailInput.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // The wine card underneath has its own Escape handler.
        event.preventDefault();
        event.stopImmediatePropagation();
        onClose();
      }
      if (event.key === 'Tab') {
        const elements = panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled):not([tabindex="-1"]), a[href]');
        if (!elements?.length) return;
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown, true);
    };
  }, [onClose]);

  useEffect(() => { if (sent) panel.current?.focus(); }, [sent]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy.current) return;
    busy.current = true;
    setSending(true);
    setError('');
    try {
      await submitWineInquiry(wine.id, email.trim(), website);
      setSent(true);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Не удалось отправить заявку. Проверьте соединение и попробуйте ещё раз.');
    } finally {
      busy.current = false;
      setSending(false);
    }
  };

  return createPortal(<div className='wine-inquiry-backdrop' onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section className='wine-inquiry' ref={panel} role='dialog' aria-modal='true' aria-labelledby={titleId} tabIndex={-1}>
      <button type='button' className='wine-inquiry__close' aria-label='Закрыть форму' onClick={onClose}>×</button>
      <span className='wine-inquiry__eyebrow'>Винные Террасы · Коллекция</span>
      <h2 id={titleId}>{sent ? 'Заявка отправлена' : 'Расскажем об этом вине'}</h2>
      {sent ? <div role='status'>
        <p>Спасибо за интерес к нашей коллекции. Мы свяжемся с вами по адресу <strong>{email.trim()}</strong> и расскажем подробнее о вине «{wine.name}».</p>
        <button type='button' className='wine-inquiry__submit' onClick={onClose}>Вернуться к вину</button>
      </div> : <>
        <div className='wine-inquiry__wine'>{wine.name}{wine.year ? ` · ${wine.year}` : ''}</div>
        <p id={noteId}>Оставьте почту, и мы свяжемся с вами по поводу этого вина.</p>
        <form onSubmit={submit} aria-busy={sending}>
          <label htmlFor={emailId}>Электронная почта</label>
          <input ref={emailInput} id={emailId} type='email' name='email' autoComplete='email' placeholder='you@example.com' maxLength={254} required value={email} disabled={sending} aria-describedby={noteId} onChange={event => { setEmail(event.target.value); setError(''); }} />
          <div className='wine-inquiry__trap' aria-hidden='true'><label>Ваш сайт<input name='website' tabIndex={-1} autoComplete='off' value={website} onChange={event => setWebsite(event.target.value)} /></label></div>
          {error && <p className='wine-inquiry__error' role='alert'>{error} <a href='/Contacts'>Контакты</a></p>}
          <button type='submit' className='wine-inquiry__submit' disabled={sending}>{sending ? 'Отправляем…' : 'Отправить заявку'}</button>
          <p className='wine-inquiry__privacy'>Используем почту, чтобы ответить на вашу заявку. <a href='/Privacy' target='_blank' rel='noopener noreferrer'>Обработка персональных данных</a></p>
        </form>
      </>}
    </section>
  </div>, document.body);
};

export default function WineInquiry({ wine }: { wine: InquiryWine }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = React.useCallback(() => { setOpen(false); trigger.current?.focus(); }, []);
  return <div className='wine-inquiry-action'>
    <button type='button' ref={trigger} className='wine-inquiry__trigger' onClick={() => setOpen(true)}>Узнать подробности <span aria-hidden='true'>→</span></button>
    {open && <InquiryDialog wine={wine} onClose={close} />}
  </div>;
}
