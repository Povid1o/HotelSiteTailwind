import React, { useCallback, useEffect, useState } from 'react';
import { $authHost, $host } from './http';
import { useContext } from 'react';
import { Context } from '../index';

type Status = 'ok' | 'fail' | 'idle';

const dot = (status: Status) => {
  const color = status === 'ok' ? '#22c55e' : status === 'fail' ? '#ef4444' : '#a3a3a3';
  return (
    <span
      style={{
        display: 'inline-block',
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: color,
        marginRight: 6,
      }}
    />
  );
};

const AdminStatusBadge: React.FC = () => {
  const ctx = useContext(Context);
  const user = ctx?.user as any;
  const isAuth = Boolean(user?.isAuth);
  const [apiStatus, setApiStatus] = useState<Status>('idle');
  const [consoleStatus, setConsoleStatus] = useState<Status>('ok');
  const [isVisible, setIsVisible] = useState(() => !document.hidden);

  const ping = useCallback(async () => {
    try {
      // Пытаемся дернуть защищенный эндпоинт, если токен есть, иначе публичный справочник
      const token = localStorage.getItem('token');
      if (token) {
        await $authHost.get('api/user/auth');
        setApiStatus('ok');
      } else {
        // Если токена нет, пингуем публичный endpoint
        await $host.get('api/wine-types');
        setApiStatus('ok');
      }
    } catch (e: any) {
      // 401 - это нормально, если токен невалиден или истек
      if (e?.response?.status === 401) {
        console.log('AdminStatusBadge: Token invalid or expired (401), API is online');
        setApiStatus('ok'); // API работает, просто токен невалиден
      } else {
        console.error('AdminStatusBadge: API ping failed:', e);
        setApiStatus('fail');
      }
    }
  }, []);

  useEffect(() => {
    const updateVisibility = () => setIsVisible(!document.hidden);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let cancelled = false;
    const run = async () => {
      await ping();
      if (!cancelled) setConsoleStatus('ok');
    };
    run();
    const id = setInterval(run, 15000);
    return () => { cancelled = true; clearInterval(id); };
  }, [isVisible, ping]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 10,
        left: 10,
        zIndex: 2000,
        background: 'rgba(17,24,39,0.85)',
        color: '#e5e7eb',
        border: '1px solid #374151',
        borderRadius: 8,
        padding: '8px 10px',
        fontSize: 12,
        lineHeight: 1.2,
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontWeight: 600 }}>Admin status</span>
      </div>
      <div style={{ marginTop: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
          {dot(isAuth ? 'ok' : 'fail')}<span>Auth: {isAuth ? 'authorized' : 'guest'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
          {dot(apiStatus)}<span>API: {apiStatus === 'ok' ? 'online' : apiStatus === 'fail' ? 'error' : 'checking...'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {dot(consoleStatus)}<span>Console: connected</span>
        </div>
      </div>
    </div>
  );
};

export default AdminStatusBadge;

