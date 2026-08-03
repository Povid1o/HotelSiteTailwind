import React, { useContext } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link, NavLink } from 'react-router-dom';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import UserStorage from '../storage/UserStorage';
import ProductStorage from '../storage/ProductStorage';

interface NavbarProps {
  nav?: boolean;
  setNav?: (nav: boolean) => void;
}

interface AppContext {
  user: UserStorage;
  product: ProductStorage;
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

  const publicLinks = [
    { to: '/Hotel', label: 'Отель' },
    { to: '/Vinery', label: 'Винодельня' },
    { to: '/Restaurant', label: 'Ресторан' },
    { to: '/Events', label: 'Мероприятия' },
  ];

  return (
    <header className='site-header'>
      <Link to='/' className='site-header__brand' onClick={closeMenu} aria-label='Винные Террасы — главная'>Винные Террасы</Link>

      <nav aria-label='Основная навигация'>
        <button
          type='button'
          className='site-nav__toggle'
          onClick={handleClick}
          aria-expanded={nav}
          aria-controls='main-navigation'
          aria-label={nav ? 'Закрыть меню' : 'Открыть меню'}
        >
          {nav ? <FaTimes aria-hidden='true' /> : <FaBars aria-hidden='true' />}
        </button>
        <ul id='main-navigation' className={`site-nav__list${nav ? ' site-nav__list--open' : ''}`}>
          {publicLinks.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={closeMenu}
                className={({ isActive }) => `site-nav__link${isActive ? ' site-nav__link--active' : ''}`}
              >
                {label}
              </NavLink>
            </li>
          ))}
          <li className='site-nav__item--disabled'><span aria-disabled='true' title='Скоро'>Центр производства</span></li>
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
      <Link to='/Hotel#booking' className='site-header__booking' onClick={closeMenu}>Забронировать</Link>
    </header>
  );
});

export default Navbar;
