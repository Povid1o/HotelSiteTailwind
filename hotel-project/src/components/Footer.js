import React from 'react';
import Logo from './assets/VineTerracesLogo.png'
import { YMaps, Map, Placemark} from '@pbe/react-yandex-maps';
import useWindowDimensions from './WindowResizeListener';

import "./styles/footer.css"



const YandexMap = () => {
    const {height, width} = useWindowDimensions();
  return (
    // <div className="w-3/4 rounded-xl bg-gray-200 mx-auto">
    <div className="w-full -z-50">
      <YMaps >
        <Map defaultState={{
            center: [55.684758, 37.738521],
            zoom: 15
            }}
            style={{ width: '${width}px', height: '240px' }}>
          <Placemark geometry={[55.684758, 37.738521]} />
        </Map>
      </YMaps>
    </div>
  );
};


const Footer = () => {

     return (
        <div>

        <footer className="bg-main_theme shadow-2xl rounded-t-lg font-body mt-14 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap">
                <div className="w-full md:w-1/4 mb-4 md:mb-0">
                  <img src={Logo} className='w-[100px]' />
                </div>
            </div>
            <hr className="border-gray-400 my-8" />
            <ul className="flex flex-wrap justify-center flex-row mx-auto text-nowrap md:gap-8 lg:gap-12 xl:gap-16">
                <div className="footer-element">
                    <h2 className="text"><a href='#' className='underlineDesktop'>Апартаменты</a></h2>
                </div>

                <div className="footer-element">
                    <h2 className="text"><a href='#' className='underlineDesktop'>Как добраться</a></h2>
                </div>

                <div className="footer-element">
                    <h2 className="text"><a href='#' className='underlineDesktop'>Контакты</a></h2>
                </div>

                <div className="footer-element">
                    <h2 className="text"><a href='#' className='underlineDesktop'>Политика конфиденциальности</a></h2>
                </div>

            </ul>
            <div className="w-full md:w-1/3 my-4 mx-auto md:mb-0 text-center">
                <p className="text-[#F8F7F4] font-body">© {new Date().getFullYear()} Винные Терассы</p>
            </div>
          </div>
        </footer>
        <YandexMap />
        </div>
      );
}
 
export default Footer;