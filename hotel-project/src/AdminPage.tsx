import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from './index';
import "./AdminPage.css";
import "./components/admin/admin.css";
import AdminShell, { AdminSection } from './components/admin/AdminShell';
import NewsAdmin from './components/admin/news/NewsAdmin';
import PagesAdmin from './components/admin/sections/PagesAdmin';
import RoomsAdmin from './components/admin/sections/RoomsAdmin';
import MenuAdmin from './components/admin/sections/MenuAdmin';
import EventsAdmin from './components/admin/sections/EventsAdmin';
import WinesAdmin from './components/admin/sections/WinesAdmin';
import { confirmDiscard, useBeforeUnloadGuard } from './components/admin/ui';
import SessionExpiredModal from './components/SessionExpiredModal';

const ADMIN_SECTIONS: AdminSection[] = [
  { key: 'pages', label: 'Страницы сайта' },
  { key: 'rooms', label: 'Номера' },
  { key: 'menu', label: 'Меню ресторана' },
  { key: 'events', label: 'Мероприятия' },
  { key: 'wines', label: 'Вина' },
  { key: 'news', label: 'Новости' },
];

const AdminPage = observer(() => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('AdminPage must be used within Context Provider');
  }
  const { dish, hotel, pageContent, wine, events, user } = context;

  // Раздел хранится в адресе (#news), чтобы после обновления страницы вы вернулись туда же.
  const [section, setSection] = useState<string>(() => {
    const fromHash = window.location.hash.replace('#', '');
    return ADMIN_SECTIONS.some((s) => s.key === fromHash) ? fromHash : 'pages';
  });
  const selectSection = (key: string) => {
    if (key === section || !confirmDiscard()) return;
    setSection(key);
    window.history.replaceState(null, '', `#${key}`);
  };
  useBeforeUnloadGuard();

  useEffect(() => {
    // Загружаем данные только если они ещё не загружены
    if (dish.dishes.length === 0) dish.loadDishes().catch(console.error);
    if (hotel.rooms.length === 0) hotel.loadRooms().catch(console.error);
    if (pageContent.pages.length === 0) pageContent.loadPageContent().catch(console.error);
    if (wine.wines.length === 0) wine.loadWines().catch(console.error);
    if (!events.categories.length || !events.events.length) events.refreshAll().catch(console.error);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Hides public-site overlays (the TravelLine booking button) while editing.
  useEffect(() => {
    document.body.classList.add('admin-mode');
    return () => document.body.classList.remove('admin-mode');
  }, []);

  if (dish.isLoading || hotel.isLoading || pageContent.isLoading || wine.isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div>Загрузка...</div>
      </div>
    );
  }

  const loadErrors = [
    ['Меню ресторана', dish.error],
    ['Номера', hotel.error],
    ['Страницы', pageContent.error],
    ['Вина', wine.error],
  ].filter(([, error]) => Boolean(error));

  if (loadErrors.length) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
        <h1 className="text-xl font-semibold text-gray-800">Не удалось загрузить данные</h1>
        {loadErrors.map(([name, error]) => (
          <p key={name} className="text-red-600">{name}: {error}</p>
        ))}
        <button type="button" className="adm-btn adm-btn-primary" onClick={() => window.location.reload()}>
          Повторить
        </button>
      </div>
    );
  }

  return (
    <div className="admin-root">
      <SessionExpiredModal />
      <AdminShell sections={ADMIN_SECTIONS} active={section} onSelect={selectSection} onLogout={() => user.logout()}>
        <div className="adm-section-page">
          {section === 'pages' && <PagesAdmin />}
          {section === 'rooms' && <RoomsAdmin />}
          {section === 'menu' && <MenuAdmin />}
          {section === 'events' && <EventsAdmin />}
          {section === 'wines' && <WinesAdmin />}
          {section === 'news' && <NewsAdmin />}
        </div>
      </AdminShell>
    </div>
  );
});

export default AdminPage;
