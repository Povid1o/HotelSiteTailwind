import React, { useContext } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link, NavLink } from 'react-router-dom';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import UserStorage from '../storage/UserStorage';

import { openTravelLineBooking } from '../utils/travelLine';

interface NavbarProps {
  nav?: boolean;
  setNav?: (nav: boolean) => void;
}

interface AppContext {
  user: UserStorage;
}

const Navbar = observer(({ nav = false, setNav }: NavbarProps) => {
  const context = useContext(Context) as AppContext | null;
  const user = context?.user;

  // В админке шапка используется без мобильного меню. Не допускаем падения
  // компонента, если управляющие props намеренно не переданы.
  const handleClick = () => setNav?.(!nav);
  const closeMenu = () => setNav?.(false);
  const handleLogout = () => {
    user?.logout();
    closeMenu();
  };

  const navLinks = [
    { to: '/', label: 'Главная' },
    { to: '/Hotel', label: 'Отель' },
    { to: '/Vinery', label: 'Винодельня' },
    { to: '/Restaurant', label: 'Ресторан' },
    { to: '/Shop', label: 'Витрина вин' },
    { to: '/Ivents', label: 'Мероприятия' },
    { to: '/Contacts', label: 'Контакты' },
  ];

  return (
    <header className='site-header'>
      <div className='site-header__logo'>
        <Link to='/' onClick={closeMenu}>
          <p className='site-header__eyebrow'>Усадьба • Резиденция</p>
          <span className='site-header__title'>Террасы</span>
        </Link>
      </div>
      <button
        type='button'
        className='site-header__toggle'
        onClick={handleClick}
        aria-label={nav ? 'Закрыть меню' : 'Открыть меню'}
      >
        {nav ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      <nav className={`site-nav${nav ? ' site-nav--open' : ''}`}>
        <ul className='site-nav__list'>
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `site-nav__link${isActive ? ' site-nav__link--active' : ''}`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
          {user?.isAuth && (
            <>
              <li>
                <NavLink to='/admin' onClick={closeMenu} className={({ isActive }) => `site-nav__link${isActive ? ' site-nav__link--active' : ''}`}>
                  Админка
                </NavLink>
              </li>
              <li>
                <button type='button' className='site-nav__action' onClick={handleLogout}>Выйти</button>
              </li>
            </>
          )}
        </ul>
      </nav>
      <a
        href='#booking'
        className='site-header__booking'
        onClick={(e) => {
          closeMenu();
          openTravelLineBooking(e);
        }}
      >
        Забронировать
      </a>
    </header>
  );
});

export default Navbar;
