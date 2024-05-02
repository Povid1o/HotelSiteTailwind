import React from 'react';
import { FooterDivider } from 'flowbite-react';

const Footer = () => {
    return (
        // Footer
        <div className='w-full h-48 mt-14 ml-auto mr-auto bg-main_theme rounded-t-lg shadow-2xl'>


        </div> 
        

<<<<<<< Updated upstream
     );
=======
    //  );

     return (
        <footer className="bg-main_theme shadow-2xl rounded-t-lg font-body mt-14 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap">
                <div className="w-full md:w-1/4 mb-4 md:mb-0">
                {/* <h2 className="text-lg text-[#F8F7F4] font-semibold mb-2">Винные Терассы</h2> */}
                    <Logo className='w-[100px]'/>
                </div>
                {/* <div className="w-full md:w-1/4 mb-4 md:mb-0">
                    <h2 className="text-lg font-semibold mb-2">Апартаменты</h2>
                
                </div>
                <div className="w-full md:w-1/4 mb-4 md:mb-0">
                    <h2 className="text-lg font-semibold mb-2">Как добраться</h2>
                
                </div>
                <div className="w-full md:w-1/4 mb-4 md:mb-0">
                    <h2 className="text-lg font-semibold mb-2">Контакты</h2>
                
                </div> */}
            </div>
            <hr className="border-gray-400 my-8" />
            <div className="flex flex-wrap flex-row mx-auto">
                <div className="w-full md:w-1/4 mb-4 md:mb-0">
                    <h2 className="text-lg text-[#F8F7F4] font-semibold mb-2">Апартаменты</h2>
                
                </div>
                <div className="w-full md:w-1/4 mb-4 md:mb-0">
                    <h2 className="text-lg text-[#F8F7F4] font-semibold mb-2">Как добраться</h2>
                
                </div>
                <div className="w-full md:w-1/4 mb-4 md:mb-0">
                    <h2 className="text-lg text-[#F8F7F4] font-semibold mb-2">Контакты</h2>
                
                </div>
                <div className="w-full md:w-1/4 mb-4 md:mb-0">
                    <h2 className="text-lg text-[#F8F7F4] font-semibold mb-2">Отзывы</h2>
                
                </div>
                <div className="w-full md:w-1/4 mb-4 md:mb-0">
                    <h2 className="text-lg text-[#F8F7F4] font-semibold mb-2">Политика конфиденциальности</h2>
                
                </div>


                {/* <div className="w-full md:w-1/3 my-4 mx-auto md:mb-0 text-center">
                    <p className="text-[#F8F7F4]">© 2023 Винные Терассы</p>
                </div> */}
                {/* <div className="w-full md:w-1/3 mb-4 md:mb-0 text-center">
                    <p className="text-gray-700">Политика конфиденциальности</p>
                </div> */}
            </div>
            <div className="w-full md:w-1/3 my-4 mx-auto md:mb-0 text-center">
                <p className="text-[#F8F7F4]">© 2023 Винные Терассы</p>
            </div>
          </div>
        </footer>
      );
>>>>>>> Stashed changes
}
 
export default Footer;