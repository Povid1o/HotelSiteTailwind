import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import { $authHost, ADMIN_SESSION_EXPIRED_EVENT, completeRelogin, waitForRelogin } from './http';
import { login } from './http/userAPI';

const SESSION_CHECK_INTERVAL_MS = 5 * 60 * 1000;

// Signs the administrator back in without leaving /admin, so open editors and
// pending saves survive an expired session.  The periodic check also renews the
// sliding session while the panel stays open on a phone or laptop.
const SessionExpiredModal = observer(() => {
  const context = useContext(Context);
  const user = context?.user;
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState(() => user?.user?.email || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener(ADMIN_SESSION_EXPIRED_EVENT, open);

    const checkSession = async () => {
      try {
        await $authHost.get('api/user/auth', { skipAuthRedirect: true } as any);
      } catch (e: any) {
        if (e?.response?.status === 401) void waitForRelogin();
      }
    };
    const checkWhenVisible = () => {
      if (document.visibilityState === 'visible') void checkSession();
    };
    const interval = window.setInterval(checkWhenVisible, SESSION_CHECK_INTERVAL_MS);
    document.addEventListener('visibilitychange', checkWhenVisible);

    return () => {
      window.removeEventListener(ADMIN_SESSION_EXPIRED_EVENT, open);
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', checkWhenVisible);
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const data = await login(email, password);
      if (data.role !== 'ADMIN') throw new Error('Недостаточно прав для входа в панель управления');
      user?.setUser(data);
      user?.setIsAuth(true);
      setPassword('');
      setIsOpen(false);
      completeRelogin();
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Не удалось выполнить вход');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/60 p-4" role="presentation">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-expired-title"
      >
        <h2 id="session-expired-title" className="text-xl font-semibold text-gray-900">Сессия истекла</h2>
        <p className="mt-2 text-sm text-gray-600">
          Войдите снова. Открытые правки останутся на месте, а несохранённые изменения отправятся после входа.
        </p>
        <label htmlFor="relogin-email" className="mt-4 block text-xs font-semibold uppercase text-gray-600">E-mail</label>
        <input
          id="relogin-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-3 text-base text-gray-900"
          required
        />
        <label htmlFor="relogin-password" className="mt-3 block text-xs font-semibold uppercase text-gray-600">Пароль</label>
        <input
          id="relogin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-3 text-base text-gray-900"
          required
        />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 min-h-[48px] w-full rounded-md bg-gray-800 font-medium uppercase text-white disabled:opacity-60"
        >
          {isSubmitting ? 'Входим…' : 'Войти'}
        </button>
      </form>
    </div>
  );
});

export default SessionExpiredModal;
