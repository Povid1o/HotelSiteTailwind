import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PhotoSelector from '../text_inputs/PhotoSelector';
import ImageWithButton from '../text_inputs/ImageWithButton';
import ImageWithButtonPersistent from '../text_inputs/ImageWithButtonPersistent';
import BackgroundContentEdit from '../text_inputs/BackgroundContentEdit';
import TextEditor from '../text_inputs/TextEditor';
import VideoWithUpload from '../text_inputs/VideoWithUpload';
import BoxEditable from '../text_inputs/BoxEditable';
import PriceList from '../text_inputs/PriceList';
import MultiInputField from '../text_inputs/MultiInputField';
import DescriptionInput from '../text_inputs/DescriptionInput';
import { FaLongArrowAltRight, FaTrashAlt, FaPlus } from "react-icons/fa";
import { getMediaUrl } from '../../utils/contentHelpers';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/hover.css'
import '../styles/vinery.css'

// Импорт изображений (не редактируемые)
import VectorImage from "../assets/Vector1.png"
import WineCaps from "../assets/WineCaps.png"
import BottleTransparent from "../assets/BottleTransparent.png"
import BottleTransparentHorizontal from "../assets/BottleTransparentHorizontal.png"
import GeografieMobile from "../assets/GeografieMobile.svg"
import GeografieTablet from "../assets/GeografieTablet.svg"
import GeografieComputer from "../assets/GeografieComputer.svg"

const Button = ({text, linkTo}) => {
    return(
        <Link to={linkTo || '/Shop'}>
            <div className="flex justify-start">
                <div className='flex-col inline-block p-2'>
                    <div className='flex flex-row '>
                        <a href="#" className='underlineDesktop text-[#3E4756] text-[18px] leading-[22px] font-semibold mx-2 md:text-2xl'>{text}</a>
                        <FaLongArrowAltRight className='w-[25px] h-[15px] left-[35px] my-auto'/>
                    </div>
                    <hr className="border-gray-400 w-full my-2" />
                </div>
            </div>
        </Link>
    )
}

const Timeline = ({ leftDates = [], rightDates = [] }) => {
    return (
        <div className="relative w-full overflow-visible">
            <div className="relative w-full overflow-visible aspect-[16/9]">
                <img
                    src={WineCaps}
                    className="absolute w-full h-full object-cover scale-[1.35] sm:scale-125"
                    alt="История винодельни"
                />
                    
                <div className="absolute inset-0 z-10">
                    {/* Левая колонка дат */}
                    <div className="absolute left-[8%] top-[15%] bottom-[15%] flex flex-col justify-around w-[30%] timeline-column">
                        {leftDates.map((date, index) => (
                            <div key={`left-${index}`} className="timeline-item">
                                <h3 className="date-header">{date.year}</h3>
                                <p className="date-content">{date.description}</p>
                            </div>
                        ))}
                    </div>
                        
                    {/* Правая колонка дат */}
                    <div className="absolute right-[8%] top-[15%] bottom-[15%] flex flex-col justify-around w-[30%] timeline-column right-column">
                        {rightDates.map((date, index) => (
                            <div key={`right-${index}`} className="timeline-item">
                                <h3 className="date-header">{date.year}</h3>
                                <p className="date-content">{date.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const VineryEdit = ({ pageData, onContentChange }) => {
    // Состояния для батч-сохранения изменений
    const [pendingStageChanges, setPendingStageChanges] = useState({});
    const [hasUnsavedStageChanges, setHasUnsavedStageChanges] = useState(false);

    // Handlers for main background
    const handleMainBackgroundTitleChange = useCallback((newTitle) => {
        onContentChange('mainBackground', { 
            ...pageData.mainBackground,
            title: newTitle 
        });
    }, [onContentChange, pageData.mainBackground]);

    const handleMainBackgroundImageChange = useCallback((newMedia: File | string | null) => {
        onContentChange('mainBackground', { 
            ...pageData.mainBackground,
            image: newMedia 
        });
    }, [onContentChange, pageData.mainBackground]);

    // Handlers for intro section
    const handleIntroSectionTitleChange = useCallback((newTitle) => {
        onContentChange('introSection', { 
            ...pageData.introSection,
            title: newTitle 
        });
    }, [onContentChange, pageData.introSection]);

    const handleIntroSectionDescriptionChange = useCallback((newDescription) => {
        onContentChange('introSection', { 
            ...pageData.introSection,
            description: newDescription 
        });
    }, [onContentChange, pageData.introSection]);

    const handleIntroSectionImageChange = useCallback((newImage: File | string | null) => {
        onContentChange('introSection', {
            ...pageData.introSection,
            image: newImage 
        });
    }, [onContentChange, pageData.introSection]);

    const handleIntroSectionButtonTextChange = useCallback((newButtonText) => {
        onContentChange('introSection', {
            ...pageData.introSection,
            buttonText: newButtonText 
        });
    }, [onContentChange, pageData.introSection]);

    const handleIntroSectionButtonLinkChange = useCallback((newButtonLink) => {
        onContentChange('introSection', {
            ...pageData.introSection,
            buttonLink: newButtonLink 
        });
    }, [onContentChange, pageData.introSection]);

    // Handlers for history section
    const handleHistorySectionTitleChange = useCallback((newTitle) => {
        onContentChange('historySection', { 
            ...pageData.historySection,
            title: newTitle 
        });
    }, [onContentChange, pageData.historySection]);

    const handleLeftDatesChange = useCallback((newDates) => {
        const formattedDates = newDates.map(date => ({
            year: date.title || '',
            description: date.price || ''
        }));
        onContentChange('historySection', {
            ...pageData.historySection,
            leftDates: formattedDates
        });
    }, [onContentChange, pageData.historySection]);

    const handleRightDatesChange = useCallback((newDates) => {
        const formattedDates = newDates.map(date => ({
            year: date.title || '',
            description: date.price || ''
        }));
        onContentChange('historySection', {
            ...pageData.historySection,
            rightDates: formattedDates
        });
    }, [onContentChange, pageData.historySection]);

    // Handlers for wine section
    const handleWineSectionFirstTextChange = useCallback((newText) => {
        onContentChange('wineSection', {
            ...pageData.wineSection,
            firstText: newText
        });
    }, [onContentChange, pageData.wineSection]);

    const handleWineSectionSecondTextChange = useCallback((newText) => {
        onContentChange('wineSection', {
            ...pageData.wineSection,
            secondText: newText
        });
    }, [onContentChange, pageData.wineSection]);

    const handleWineSectionButtonTextChange = useCallback((newButtonText) => {
        onContentChange('wineSection', {
            ...pageData.wineSection,
            buttonText: newButtonText
        });
    }, [onContentChange, pageData.wineSection]);

    const handleWineSectionButtonLinkChange = useCallback((newButtonLink) => {
        onContentChange('wineSection', {
            ...pageData.wineSection,
            buttonLink: newButtonLink
        });
    }, [onContentChange, pageData.wineSection]);

    // Handlers for production section
    const handleProductionSectionTitleChange = useCallback((newTitle) => {
        onContentChange('productionSection', {
            ...pageData.productionSection,
            title: newTitle
        });
    }, [onContentChange, pageData.productionSection]);

    const handleProductionStageChange = useCallback((stageIndex, newData) => {
        // Накапливаем изменения вместо немедленной отправки
        setPendingStageChanges(prev => {
            const currentStage = pageData.productionSection.stages[stageIndex];
            return {
                ...prev,
                [stageIndex]: {
                    ...currentStage,
                    ...prev[stageIndex],
                    ...newData
                }
            };
        });
        setHasUnsavedStageChanges(true);
    }, [pageData.productionSection.stages]);
    
    // Функция для сохранения всех накопленных изменений
    const handleSaveProductionChanges = useCallback(() => {
        const updatedStages = pageData.productionSection.stages.map((stage, index) => {
            return pendingStageChanges[index] || stage;
        });
        
        onContentChange('productionSection', {
            ...pageData.productionSection,
            stages: updatedStages
        });
        
        setPendingStageChanges({});
        setHasUnsavedStageChanges(false);
    }, [pendingStageChanges, pageData.productionSection, onContentChange]);
    
    // Функция для отмены изменений
    const handleCancelProductionChanges = useCallback(() => {
        setPendingStageChanges({});
        setHasUnsavedStageChanges(false);
    }, []);

    const handleProductionStageRemove = useCallback((stageIndex) => {
        const updatedStages = pageData.productionSection.stages.filter((_, index) => index !== stageIndex);
        
        onContentChange('productionSection', {
            ...pageData.productionSection,
            stages: updatedStages
        });
    }, [onContentChange, pageData.productionSection]);

    const handleProductionStageAdd = useCallback(() => {
        const newStage = {
            name: "Новый процесс",
            image: null
        };
        
        onContentChange('productionSection', {
            ...pageData.productionSection,
            stages: [...pageData.productionSection.stages, newStage]
        });
    }, [onContentChange, pageData.productionSection]);

    // Handlers for region section
    const handleRegionSectionTitleChange = useCallback((newTitle) => {
        onContentChange('regionSection', {
            ...pageData.regionSection,
            title: newTitle
        });
    }, [onContentChange, pageData.regionSection]);

    const handleRegionSectionFirstTextChange = useCallback((newText) => {
        onContentChange('regionSection', {
            ...pageData.regionSection,
            firstText: newText
        });
    }, [onContentChange, pageData.regionSection]);

    const handleRegionSectionSecondTextChange = useCallback((newText) => {
        onContentChange('regionSection', {
            ...pageData.regionSection,
            secondText: newText
        });
    }, [onContentChange, pageData.regionSection]);

    const handleRegionSectionBackgroundImageChange = useCallback((newImage: File | string | null) => {
        onContentChange('regionSection', {
            ...pageData.regionSection,
            backgroundImage: newImage
        });
    }, [onContentChange, pageData.regionSection]);
    
    // Функция для создания стабильного URL для отображения
    const getDisplayImageSrc = (imageSrc) => {
        if (!imageSrc) return null;
        
        // Если это File объект, создаем blob URL
        if (imageSrc instanceof File) {
            return URL.createObjectURL(imageSrc);
        }
        
        // Если это строка, преобразуем относительные пути в полные URL
        if (typeof imageSrc === 'string') {
            return getMediaUrl(imageSrc);
        }
        
        return null;
    };

    // Преобразование данных истории для PriceList
    const leftDatesForPriceList = pageData.historySection?.leftDates?.map(date => ({
        title: date.year,
        price: date.description
    })) || [];

    const rightDatesForPriceList = pageData.historySection?.rightDates?.map(date => ({
        title: date.year,
        price: date.description
    })) || [];

    return ( 
        <div name='home' className="w-full h-max bg-white font-body 3xl:max-w-screen-3xl 3xl:mx-auto">
            {/* Header with background */}
            <header className="flex flex-col relative">
                <BackgroundContentEdit 
                    backgroundMedia={pageData.mainBackground?.image}
                    onMediaChange={handleMainBackgroundImageChange}
                    acceptedTypes="image/*,video/*"
                >
                    <div className="max-w-[700px] h-screen mx-auto px-16 flex flex-col justify-center content-center text-center xl:max-w-[900px]">
                        <div className="flex max-w-screen-lg flex-wrap items-end gap-4 px-4 py-3">
                            <TextEditor 
                                text={pageData.mainBackground?.title} 
                                format="header" 
                                isShort={true} 
                                onSave={handleMainBackgroundTitleChange} 
                            />
                        </div>
                    </div>
                </BackgroundContentEdit>
                
                {/* Векторное изображение */}
                <img
                    src={VectorImage}
                    alt="Разделительный вектор"
                    className="absolute z-[1] bottom-0 w-screen left-1/2 transform"
                    style={{ transform: 'translateX(-50%) translateY(45%)' }}
                />
            </header>

            {/* Brick 1 - Intro Section */}
            <section>
                {/* Tablet & Computer */}
                <section className="hidden sm:grid grid-flow-row-dense grid-cols-5 mx-auto mt-8 w-[92%] xl:w-[85%] 2xl:max-w-screen-2xl 2xl:mx-auto">
                    <div className='z-10 col-span-2 flex flex-col'>
                        <div className='max-w-screen-lg text-left text-[#3E4756] pt-8 paragraph-content'>
                            <TextEditor 
                                text={pageData.introSection?.description} 
                                format="paragraph" 
                                onSave={handleIntroSectionDescriptionChange} 
                            />
                        </div>
                        
                        <div className="flex justify-start">
                            <div className='flex-col inline-block py-8 pr-8 bottom-3'>
                                <div className='flex flex-row mb-2'>
                                    <div className='text-[#3E4756] leading-[38px] mx-2 text-lg mobile:text-xl md:text-2xl xl:text-3xl 2xl:text-4xl font-semibold'>
                                        <DescriptionInput 
                                            text={pageData.introSection?.buttonText}
                                            inputField={true}
                                            horizontal={false}
                                            onSave={handleIntroSectionButtonTextChange}
                                        />
                                    </div>
                                    <FaLongArrowAltRight className='w-[25px] h-[15px] xl:w-[30px] xl:h-[20px] 2xl:w-[35px] 2xl:h-[25px] left-[35px] my-auto'/>
                                </div>
                                {/* <div className='mb-2'>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ссылка кнопки:</label>
                                    <DescriptionInput 
                                        text={pageData.introSection?.buttonLink}
                                        inputField={true}
                                        horizontal={false}
                                        onSave={handleIntroSectionButtonLinkChange}
                                    />
                                </div> */}
                                <hr className="border-gray-400 w-full my-2" />
                            </div>
                        </div>
                    </div>
                    
                    <div className='col-span-3 z-10 transform -translate-y-1/4 xl:size-[110%] 2xl:size-[100%] 2xl:max-w-[1000px] 2xl:object-contain'>
                        <ImageWithButtonPersistent 
                            image={getDisplayImageSrc(pageData.introSection?.image) || ''} 
                            onImageChange={handleIntroSectionImageChange}
                        />
                    </div>
                </section>

                {/* Mobile */}
                <section className="mx-auto mt-12 w-[92%] sm:hidden">
                    <div className='z-10 col-span-2 flex flex-col'>
                        <div className='max-w-screen-lg font-normal text-[12px] leading-[24px] text-left text-[#3E4756]'>
                            <TextEditor 
                                text={pageData.introSection?.description} 
                                format="paragraph" 
                                onSave={handleIntroSectionDescriptionChange} 
                            />
                        </div>
                        
                        <div className="flex justify-start">
                            <div className='flex-col inline-block py-8 pr-8 bottom-3'>
                                <div className='flex flex-row mb-2'>
                                    <div className='text-[#3E4756] text-[18px] leading-[22px] font-semibold mx-2'>
                                        <DescriptionInput 
                                            text={pageData.introSection?.buttonText}
                                            inputField={true}
                                            horizontal={false}
                                            onSave={handleIntroSectionButtonTextChange}
                                        />
                                    </div>
                                    <FaLongArrowAltRight className='w-[25px] h-[15px] left-[35px] my-auto'/>
                                </div>
                                {/* <div className='mb-2'>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ссылка кнопки:</label>
                                    <DescriptionInput 
                                        text={pageData.introSection?.buttonLink}
                                        inputField={true}
                                        horizontal={false}
                                        onSave={handleIntroSectionButtonLinkChange}
                                    />
                                </div> */}
                                <hr className="border-gray-400 w-full my-2" />
                            </div>
                        </div>
                    </div>
                    
                    <div className='size-[60%] mx-auto col-span-3 transform translate-x-1/3' style={{ "--tw-translate-y": "-35%" }}>
                        <ImageWithButtonPersistent 
                            image={getDisplayImageSrc(pageData.introSection?.image) || ''} 
                            onImageChange={handleIntroSectionImageChange}
                        />
                    </div>
                </section>
            </section>

            {/* Brick 2 - History Section */}
            <section className="relative w-full overflow-visible pb-16 lg:py-32">
                <div className='section-header ml-4 sm:ml-8 lg:ml-12 xl:ml-16 2xl:ml-20'>
                    <TextEditor 
                        text={pageData.historySection?.title} 
                        format="modal" 
                        isShort={true} 
                        onSave={handleHistorySectionTitleChange} 
                    />
                </div>
                
                {/* <Timeline leftDates={pageData.historySection?.leftDates || []} rightDates={pageData.historySection?.rightDates || []} /> */}
                
                {/* Редактирование дат */}
                <div className="w-[92%] mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Левая колонка дат:</h3>
                        <PriceList 
                            globalPrices={leftDatesForPriceList}
                            onSave={handleLeftDatesChange}
                        />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Правая колонка дат:</h3>
                        <PriceList 
                            globalPrices={rightDatesForPriceList}
                            onSave={handleRightDatesChange}
                        />
                    </div>
                </div>
            </section>

            {/* Brick 3 - Wine Section */}
            <section className='relative w-[92%] mx-auto xl:w-[85%] 2xl:mx-auto'>
                <div className='hidden md:grid md:grid-flow-row-dense md:grid-cols-4'>
                    <div className='col-span-2 paragraph-content 2xl:my-auto'>
                        <TextEditor 
                            text={pageData.wineSection?.firstText} 
                            format="paragraph" 
                            onSave={handleWineSectionFirstTextChange} 
                        />
                    </div>
                    {/* <div className="col-span-2 relative flex justify-center items-center 2xl:scale-125">
                        <img 
                            src={BottleTransparent} 
                            className='mx-auto h-auto transform -translate-y-1/2 scale-110 xl:scale-125 2xl:scale-150'
                        />
                    </div> */}
                    <div className='col-span-2 2xl:my-auto'>
                        <div className='flex-col inline-block py-8 pr-8 bottom-3'>
                            <div className="flex flex-row mb-4">
                                <div className='text-[#3E4756] leading-[38px] mx-2 text-lg mobile:text-xl md:text-2xl xl:text-3xl 2xl:text-4xl font-semibold'>
                                    <DescriptionInput 
                                        text={pageData.wineSection?.buttonText}
                                        inputField={true}
                                        horizontal={false}
                                        onSave={handleWineSectionButtonTextChange}
                                    />
                                </div>
                                <FaLongArrowAltRight className='w-[25px] h-[15px] xl:w-[30px] xl:h-[20px] 2xl:w-[35px] 2xl:h-[25px] left-[35px] my-auto'/>
                                {/* <div className='mb-2'>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ссылка кнопки:</label>
                                    <DescriptionInput 
                                        text={pageData.wineSection?.buttonLink}
                                        inputField={true}
                                        horizontal={false}
                                        onSave={handleWineSectionButtonLinkChange}
                                    />
                                </div> */}
                                
                            </div>
                            <hr className="border-gray-400 w-full my-2" />
                        </div>
                        <div className='paragraph-content'>
                            <TextEditor 
                                text={pageData.wineSection?.secondText} 
                                format="paragraph" 
                                onSave={handleWineSectionSecondTextChange} 
                            />
                        </div>
                    </div>
                </div>

                <div className='w-[92%] mx-auto md:hidden'>
                    <div className='font-normal text-left text-[12px] leading-[24px] mb-2'>
                        <TextEditor 
                            text={pageData.wineSection?.firstText} 
                            format="paragraph" 
                            onSave={handleWineSectionFirstTextChange} 
                        />
                    </div>
                    <img src={BottleTransparentHorizontal} className='mx-auto mb-2'/>
                    <div className='font-normal text-right text-[12px] leading-[24px]'>
                        <TextEditor 
                            text={pageData.wineSection?.secondText} 
                            format="paragraph" 
                            onSave={handleWineSectionSecondTextChange} 
                        />
                    </div>
                    <div className='w-fit mx-auto mt-4'>
                        <div className='flex flex-row mb-2'>
                            <div className='text-[#3E4756] text-[18px] leading-[22px] font-semibold mx-2'>
                                <DescriptionInput 
                                    text={pageData.wineSection?.buttonText}
                                    inputField={true}
                                    horizontal={false}
                                    onSave={handleWineSectionButtonTextChange}
                                />
                            </div>
                            <FaLongArrowAltRight className='w-[25px] h-[15px] xl:w-[30px] xl:h-[20px] 2xl:w-[35px] 2xl:h-[25px] left-[35px] my-auto'/>
                        </div>
                        {/* <div className='mb-2'>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ссылка кнопки:</label>
                            <DescriptionInput 
                                text={pageData.wineSection?.buttonLink}
                                inputField={true}
                                horizontal={false}
                                onSave={handleWineSectionButtonLinkChange}
                            />
                        </div> */}
                    </div>
                </div>
            </section>

            {/* Brick 4 - Production Section */}
            <section className='overflow-visible mx-auto'>
                <div className='w-[92%] mx-auto'>
                    <div className='flex items-center justify-between mb-4 sm:mb-8'>
                        <div className='section-header'>
                            <TextEditor 
                                text={pageData.productionSection?.title} 
                                format="modal" 
                                isShort={true} 
                                onSave={handleProductionSectionTitleChange} 
                            />
                        </div>
                        <button
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2"
                            onClick={handleProductionStageAdd}
                        >
                            <FaPlus className="w-4 h-4" />
                            Добавить процесс
                        </button>
                    </div>
                    
                    {/* Редактирование процессов производства */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {(pageData.productionSection?.stages || []).map((stage, index) => (
                            <div key={`stage-${index}`} className="relative">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-600">Процесс {index + 1}</span>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                                        onClick={() => handleProductionStageRemove(index)}
                                        title="Удалить процесс"
                                    >
                                        <FaTrashAlt className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className={pendingStageChanges[index] ? 'ring-2 ring-orange-400 rounded-lg' : ''}>
                                    <BoxEditable
                                        name={pendingStageChanges[index]?.name || stage.name}
                                        imgSrc={getDisplayImageSrc(pendingStageChanges[index]?.image || stage.image) || ''}
                                        onDataChange={(newData) => handleProductionStageChange(index, newData)}
                                    >
                                    <p className='mx-10 my-auto text-lg mobile:text-xl md:text-2xl font-semibold'>
                                        {stage.name}
                                    </p>
                                </BoxEditable>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Кнопки сохранения/отмены изменений */}
                    {hasUnsavedStageChanges && (
                        <div className="flex gap-4 justify-center mt-6 p-4 bg-yellow-50 rounded-lg">
                            <button
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2"
                                onClick={handleSaveProductionChanges}
                            >
                                <span>Сохранить изменения</span>
                                {Object.keys(pendingStageChanges).length > 0 && (
                                    <span className="bg-white text-green-600 px-2 py-1 rounded-full text-sm font-bold">
                                        {Object.keys(pendingStageChanges).length}
                                    </span>
                                )}
                            </button>
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl"
                                onClick={handleCancelProductionChanges}
                            >
                                Отменить изменения
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Brick 5 - Region Section */}
            <section className='w-[92%] mx-auto mt-8'>
                {/* Универсальная версия для админки (все разрешения) */}
                <div className='flex flex-row overflow-visible pb-5 relative'>
                    <div className='flex flex-col relative' style={{ width: 'calc(100% - 286px)' }}>
                        <div className='w-full pr-5'>
                            <div className='paragraph-content'>
                                <TextEditor 
                                    text={pageData.regionSection?.firstText} 
                                    format="paragraph" 
                                    onSave={handleRegionSectionFirstTextChange} 
                                />
                            </div>
                            <div className='paragraph-content pt-4'>
                                <TextEditor 
                                    text={pageData.regionSection?.secondText} 
                                    format="paragraph" 
                                    onSave={handleRegionSectionSecondTextChange} 
                                />
                            </div>
                        </div>
                        
                        <div className="relative overflow-visible" style={{ height: 'auto', position: 'relative' }}>
                            <img 
                                src={GeografieTablet} 
                                className='overflow-visible scale-125 max-w-none md:scale-150' 
                                style={{ 
                                    position: 'relative',
                                    zIndex: 1 
                                }} 
                                alt="География винодельни" 
                            />
                        </div>
                    </div>
                    
                    <div 
                        className="w-[286px] min-w-[286px]"
                        style={{ zIndex: 2 }}
                    >
                        {/* Заголовок над картинкой */}
                        <div className='section-header mb-4'>
                            <TextEditor 
                                text={pageData.regionSection?.title} 
                                format="custom"
                                style="text-gray-700 text-4xl font-bold lg:text-5xl xl:text-6xl"
                                isShort={true} 
                                onSave={handleRegionSectionTitleChange} 
                            />
                        </div>
                        
                        {/* Картинка ниже */}
                        <div className="relative w-full h-[354px] rounded-[8px] overflow-hidden">
                            <ImageWithButtonPersistent 
                                image={getDisplayImageSrc(pageData.regionSection?.backgroundImage) || ''} 
                                onImageChange={handleRegionSectionBackgroundImageChange}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default VineryEdit;