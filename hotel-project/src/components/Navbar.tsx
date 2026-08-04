import React, { useContext, useState } from 'react';
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
  const [internalNav, setInternalNav] = useState(false);
  const isMenuOpen = setNav ? nav : internalNav;

  // Некоторые старые страницы используют Navbar без управляющих props.
  // В этом случае меню остаётся полностью рабочим за счёт локального состояния.
  const setMenuOpen = (next: boolean) => {
    setInternalNav(next);
    setNav?.(next);
  };
  const handleClick = () => setMenuOpen(!isMenuOpen);
  const closeMenu = () => setMenuOpen(false);
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
    { to: '/Events', label: 'Мероприятия' },
    { to: '/Contacts', label: 'Контакты' },
  ];

  return (
    <header className='site-header'>
      <Link to='/' className='site-header__brand' onClick={closeMenu} aria-label='Винные Террасы — главная'>
        Винные Террасы
      </Link>
      <button
        type='button'
        className='site-nav__toggle'
        onClick={handleClick}
        aria-expanded={isMenuOpen}
        aria-controls='site-navigation'
        aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
      >
        {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      <nav id='site-navigation' className={`site-nav${isMenuOpen ? ' site-nav--open' : ''}`}>
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
