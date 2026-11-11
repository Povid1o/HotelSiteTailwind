import React, { useEffect, useState } from 'react';
import { getWineInquirySettings, saveWineInquirySettings, WineInquirySettings as Settings } from '../../http/wineInquiryAPI';
import { useDirtyGuard, useSaveFlow } from '../ui';

export default function WineInquirySettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loadError, setLoadError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [recipientEmail, setRecipientEmail] = useState('');
  const dirty = settings !== null && recipientEmail !== settings.recipientEmail;
  useDirtyGuard(dirty);
  const { saving, msg, setMsg, run } = useSaveFlow();
  useEffect(() => {
    let cancelled = false;
    setLoadError('');
    getWineInquirySettings().then(value => {
      if (!cancelled) { setSettings(value); setRecipientEmail(value.recipientEmail); }
    }).catch(() => {
      if (!cancelled) setLoadError('Не удалось загрузить настройки заявок.');
    });
    return () => { cancelled = true; };
  }, [attempt]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (saving || !settings) return;
    await run(async () => {
      const next = await saveWineInquirySettings(recipientEmail.trim());
      setSettings(next);
      setRecipientEmail(next.recipientEmail);
      return null;
    });
  };

  return <section className='adm-card adm-inquiry-settings' aria-labelledby='wine-inquiry-settings-title'>
    <h2 id='wine-inquiry-settings-title'>Заявки на вино</h2>
    <p className='adm-hint'>На этот адрес приходят заявки из карточек вина. В письме будут выбранное вино и почта посетителя; кнопка «Ответить» позволит связаться с ним напрямую.</p>
    {loadError ? <p role='alert'>{loadError} <button type='button' className='adm-btn adm-btn-ghost adm-btn-sm' onClick={() => setAttempt(value => value + 1)}>Повторить</button></p> : <form onSubmit={save}>
      <div className='adm-field'>
        <label htmlFor='wine-inquiry-recipient'>Email для заявок на вино</label>
        <div className='adm-inquiry-settings__row'>
          <input id='wine-inquiry-recipient' className='adm-input' type='email' maxLength={254} placeholder={settings ? 'wine@example.com' : 'Загрузка…'} value={recipientEmail} disabled={!settings || saving} onChange={event => { setRecipientEmail(event.target.value); setMsg(null); }} />
          <button type='submit' className='adm-btn adm-btn-primary' disabled={!settings || saving || !dirty}>{saving ? 'Сохраняем…' : 'Сохранить'}</button>
        </div>
        <p className='adm-hint'>Пустой адрес отключает приём заявок.</p>
      </div>
      {settings && !settings.smtpConfigured && <p className='adm-hint adm-status is-warn'>Отправка почты ещё не подключена. Для приёма заявок настройте SMTP на сервере.</p>}
      {settings?.smtpConfigured && !dirty && settings.recipientEmail && <p className='adm-hint'>Отправка почты подключена. Заявки будут приходить на сохранённый адрес.</p>}
      {msg && <p className={`adm-status${msg.kind === 'error' ? ' is-error' : ''}`} role={msg.kind === 'error' ? 'alert' : 'status'}>{msg.text}</p>}
    </form>}
  </section>;
}
