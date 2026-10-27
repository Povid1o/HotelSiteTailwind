import React, { useEffect, useState } from 'react';

export interface AdminSection {
  key: string;
  label: string;
}

interface Props {
  sections: AdminSection[];
  active: string;
  onSelect: (key: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

/**
 * Рамка админки: слева боковое меню, на планшете оно становится верхней панелью,
 * на телефоне прячется за кнопкой «Меню».
 */
const AdminShell: React.FC<Props> = ({ sections, active, onSelect, onLogout, children }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open]);

  const pick = (key: string) => {
    onSelect(key);
    setOpen(false);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="adm-shell">
      <aside className={`adm-side${open ? ' is-open' : ''}`}>
        <div className="adm-side-head">
          <div>
            <div className="adm-brand">Винные Террасы</div>
            <div className="adm-brand-sub">Управление сайтом</div>
          </div>
          <button
            type="button"
            className="adm-menu-btn"
            aria-expanded={open}
            aria-controls="adm-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M4 4l10 10M14 4L4 14" /> : <path d="M3 5h12M3 9h12M3 13h12" />}
            </svg>
            Меню
          </button>
        </div>

        <nav className="adm-nav" id="adm-nav" aria-label="Разделы админки">
          {sections.map((s) => (
            <button
              key={s.key}
              type="button"
              aria-current={s.key === active ? 'page' : undefined}
              onClick={() => pick(s.key)}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <div className="adm-side-foot">
          <a href="/" target="_blank" rel="noopener noreferrer">Открыть сайт ↗</a>
          <button type="button" onClick={onLogout}>Выйти</button>
        </div>
      </aside>

      <main className="adm-main">{children}</main>
    </div>
  );
};

export default AdminShell;
