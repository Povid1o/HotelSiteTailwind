import React, { useContext } from 'react';
import Logo from './assets/VineTerracesLogo.png';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './styles/hover.css';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import UserStorage from '../storage/UserStorage';
import ProductStorage from '../storage/ProductStorage';

interface NavbarProps {
  nav: boolean;
  setNav: (nav: boolean) => void;
}

interface AppContext {
  user: UserStorage;
  product: ProductStorage;
}

const Navbar = observer(({ nav, setNav }: NavbarProps) => {
  const context = useContext(Context) as AppContext | null;
  const user = context?.user;

  const handleClick = () => setNav(!nav);
  const handleLogout = () => {
    user?.logout();
  };

  return (
    <nav className='fixed w-screen h-[80px] font-body flex justify-between items-center px-4 bg-main_theme text-white z-[30]'>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css"
        integrity="sha512-wnea99uKIC3TJF7v4eKk4Y+lMz2Mklv18+r4na2Gn1abDRPPOeef95xTzdwGD9e6zXJBteMIhZ1+68QC5byJZw=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />

      <div>
        <img src={Logo} className='w-[100px]' alt="Логотип" />
      </div>

      {/* Menu */}
      {user?.isAuth ? (
        <ul className='hidden md:flex '>
          <li className='underlineDesktop computerList'>
            <Link to='/Hotel'>Отель</Link>
          </li>
          <li className='underlineDesktop computerList'>
            <Link to='/Vinery'>Винодельня</Link>
          </li>
          <li className='underlineDesktop computerList'>
            <Link to='/Restaurant'>Ресторан</Link>
          </li>
          <li className='underlineDesktop computerList'>
            <Link to='/Events'>Мероприятия</Link>
          </li>
            <li className='underlineDesktop text-lg'>
                <Link to='/ProductionCenter'>Центр производства</Link>
            </li>
          <li className='underlineDesktop text-lg'>
            <Link to='/admin'>Панель Админа</Link>
          </li>
          <li className='underlineDesktop computerList' onClick={handleLogout}>
            Выйти
          </li>
        </ul>
      ) : (
        <ul className='hidden md:flex '>
          <li className='underlineDesktop computerList'>
            <Link to='/Hotel'>Отель</Link>
          </li>
          <li className='underlineDesktop computerList'>
            <Link to='/Vinery'>Винодельня</Link>
          </li>
          <li className='underlineDesktop computerList'>
            <Link to='/Restaurant'>Ресторан</Link>
          </li>
          <li className='underlineDesktop computerList'>
            <Link to='/Events'>Мероприятия</Link>
          </li>
            <li className='underlineDesktop text-lg'>
                <Link to='/ProductionCenter'>Центр производства</Link>
            </li>
        </ul>
      )}

      {/* Hamburger */}
      <div onClick={handleClick} className="md:hidden z-[31]">
        {!nav ? <FaBars /> : <FaTimes />}
      </div>

      {/* Mobile Menu */}
      <ul
        className={
          !nav
            ? 'absolute top-0 left-0 opacity-0 invisible'
            : 'transition-opacity duration-300 ease-out opacity-100 absolute top-0 left-0 w-full h-screen bg-main_theme flex flex-col justify-center items-center visible'
        }
      >
        <li className='py-6 text-4xl underlineMobile'>
          <Link to='/Hotel'>Отель</Link>
        </li>
        <li className='py-6 text-4xl underlineMobile'>
          <Link to='/Vinery'>Винодельня</Link>
        </li>
        <li className='py-6 text-4xl underlineMobile'>
          <Link to='/Restaurant'>Ресторан</Link>
        </li>
        <li className='py-6 text-4xl underlineMobile'>
          <Link to='/Events'>Мероприятия</Link>
        </li>
          <li className='py-6 text-4xl underlineMobile'>
              <Link to='/ProductionCenter'>Центр Производства</Link>
          </li>
      </ul>
    </nav>
  );
});

export default Navbar;