import React from 'react';
import {ReactComponent as Logo} from './assets/Logo2.svg';
import {FaBars, FaTimes} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './hover.css';

// import { useState } from 'react';



const Navbar = ({nav, setNav}) => {

    // const [nav,  setNav] = useState(false);
    const handleClick = () => setNav(!nav);




    return (
        
        <div className='fixed w-full h-[80px] font-body flex justify-between items-center px-4 bg-main_theme text-white z-[9]'>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" integrity="sha512-wnea99uKIC3TJF7v4eKk4Y+lMz2Mklv18+r4na2Gn1abDRPPOeef95xTzdwGD9e6zXJBteMIhZ1+68QC5byJZw==" crossorigin="anonymous" referrerpolicy="no-referrer" />

            <div>
                <Logo className='w-[50px]'/>
            </div>

            {/*  Menu */}
            <ul className='hidden md:flex '>
                <li className='underlineDesktop text-lg '><Link to='/'>О нас</Link></li>
                <li className='underlineDesktop text-lg'><Link to='/'>Отель</Link ></li>
                <li className='underlineDesktop text-lg'><Link to='/Винодельня'>Винодельня</Link ></li>
                <li className='underlineDesktop text-lg'><Link to='/Ресторан'>Ресторан</Link ></li>
                <li className='underlineDesktop text-lg'><Link to='/Мероприятия'>Мероприятия</Link ></li>
            </ul>
            


            {/*  Hamburger */}
            <div onClick={handleClick} className="md:hidden z-10">
                {!nav ? <FaBars /> :  <FaTimes />}
            </div>

            {/*  Mobile Menu */}
            
            <ul className= {!nav ? 'absolute top-0 left-0 opacity-0' : 'transition-opacity duration-300 ease-out opacity-100 absolute top-0 left-0 w-full h-screen bg-main_theme flex flex-col justify-center items-center'}>
                <li className='py-6 text-4xl underlineMobile'><a href='#'>О нас</a></li>
                <li className='py-6 text-4xl underlineMobile'><a href='#'>Отель</a></li>
                <li className='py-6 text-4xl underlineMobile'><a href='#'>Винодельня</a></li>
                <li className='py-6 text-4xl underlineMobile'><a href='#'>Ресторан</a></li>
                <li className='py-6 text-4xl underlineMobile'><a href='#'>Мероприятия</a></li>
            </ul>






        </div>
        
      );
}
 
export default Navbar;