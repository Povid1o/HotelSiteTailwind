import React from 'react';
import {ReactComponent as Logo} from './assets/Logo2.svg';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-main_theme bg-opacity-80">
      <div className="flex flex-col items-center">
        <Logo className='animate-pulse w-[40%] h-[40%] my-4'/>
        {/* <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div> */}
        {/* <p className="mt-2 text-white">Загрузка...</p> */}
      </div>
    </div>
  );
};

export default LoadingScreen;