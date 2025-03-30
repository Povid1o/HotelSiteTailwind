import React from 'react';
// import {ReactComponent as Logo} from './assets/Logo2.svg';
import Logo from './assets/VineTerracesLogo.png'

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-main_theme bg-opacity-80">
      <div className="flex flex-col items-center">
        <img src={Logo} className='animate-pulse w-[40%] h-[40%] my-4' />
      </div>
    </div>
  );
};

export default LoadingScreen;