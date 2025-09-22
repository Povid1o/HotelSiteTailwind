// Нужно
import React, { useState, useCallback, useContext, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeEdit from './components/pages_editable/HomeEdit';
import VineryEdit from './components/pages_editable/VineryEdit';
import Card from './components/cards/Card';

import CreateProduct from './components/modals/CreateProduct';
import CreateClase from './components/modals/CreateClase';
import CreateType from './components/modals/СreateType';
import ModalsCard from './components/modals/ModalsCard'

import { Context } from './index';
import { observer } from 'mobx-react-lite';

import NewRoomCard from './components/modals/NewRoomCard';
import NewDishCard from './components/modals/NewDishCard';
import NewWineCard from './components/modals/NewWineCard';
import ExtCard from './components/cards/ExtCard';
import DescriptionInput from './components/text_inputs/DescriptionInput';
import Button from './components/text_inputs/Button';
import { Tabs } from "flowbite-react";
import { Table } from "flowbite-react";
import "./AdminPage.css";
// Нужно
// (можно будет удалить, когда вставим бэк)
import Bottle from './components/assets/wine-bottle.png';
import Calendar from './components/assets/calendar.png';
import Excursion from './components/assets/excursion.png';
import Running from './components/assets/running.png';

import { FaTrashAlt } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { IoTicket } from "react-icons/io5";
import { FaWineGlassAlt } from "react-icons/fa";
import { FaHotel } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { MdOutlineRestaurant, MdModeEdit } from "react-icons/md";
// Нужно

// Начальные изображения для комнат
const initialImages = [
  { src: Calendar, alt: 'Calendar' },
  { src: Excursion, alt: 'Excursion' },
  { src: Running, alt: 'Running' },
  { src: Bottle, alt: 'Bottle' },
];

const addType = () => {
  return (
    <Card>
      <button className="bg-main_theme hover:bg-rose-950 text-white font-bold py-2 px-4 rounded-xl w-48">
        Добавить тип
      </button>
    </Card>
  );
};

const addClase = () => {
  return (
    <Card>
      <button className="bg-main_theme hover:bg-rose-950 text-white font-bold py-2 px-4 rounded-xl w-48">
        Добавить Класс
      </button>
    </Card>
  );
};

const addProduct = () => {
  return (
    <Card>
      <button className="bg-main_theme hover:bg-rose-950 text-white font-bold py-2 px-4 rounded-xl w-48">
        Добавить Продукт
      </button>
    </Card>
  );
};

const AddCategory = ({onClick}) => {
  return (
    <Card>
      <button className="bg-main_theme hover:bg-rose-950 text-white font-bold py-2 px-4 rounded-xl w-48" onClick={onClick}>
        Добавить Категорию
      </button>
    </Card>
  );
};

const AdminPage = observer(() =>  {
  const context = useContext(Context);
  if (!context) {
    throw new Error('AdminPage must be used within Context Provider');
  }
  const { dish, hotel, pageContent, wine } = context;

  useEffect(() => {
    console.log('=== НАЧАЛО ЗАГРУЗКИ ДАННЫХ ===');
    console.log('API_URL:', process.env.REACT_APP_API_URL);
    
    const loadData = async () => {
      try {
        console.log('Загружаем блюда...');
        await dish.loadDishes();
        console.log('✅ Блюда загружены:', dish.dishes);
      } catch (error) {
        console.error('❌ Ошибка загрузки блюд:', error);
        console.error('Детали ошибки:', {
          message: error.message,
          stack: error.stack,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText
        });
      }
  
      try {
        console.log('Загружаем номера...');
        await hotel.loadRooms();
        console.log('✅ Номера загружены:', hotel.rooms);
      } catch (error) {
        console.error('❌ Ошибка загрузки номеров:', error);
        console.error('Детали ошибки:', {
          message: error.message,
          stack: error.stack,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText
        });
      }
  
      try {
        console.log('Загружаем контент страниц...');
        await pageContent.loadPageContent();
        console.log('✅ Контент страниц загружен:', pageContent.pages);
      } catch (error) {
        console.error('❌ Ошибка загрузки контента страниц:', error);
        console.error('Детали ошибки:', {
          message: error.message,
          stack: error.stack,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText
        });
      }
  
      try {
        console.log('Загружаем вина...');
        await wine.loadWines();
        console.log('✅ Вина загружены:', wine.wines);
      } catch (error) {
        console.error('❌ Ошибка загрузки вин:', error);
        console.error('Детали ошибки:', {
          message: error.message,
          stack: error.stack,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText
        });
      }
    };
  
    loadData();
  }, [dish, hotel, pageContent, wine]);

  useEffect(() => {
    // Загружаем данные при монтировании компонента
    dish.loadDishes().catch(console.error);
    hotel.loadRooms().catch(console.error);
    pageContent.loadPageContent().catch(console.error);
    wine.loadWines().catch(console.error);
  }, [dish, hotel, pageContent, wine]);

  // НАЧАЛО ФУНКЦИЙ ДЛЯ ПРОДУКТОВ

  // Состояние для отслеживания режима редактирования категорий
  const [editingCategory, setEditingCategory] = useState<string | null>(null);


  // Вместо addCategory используйте:
  const addCategory = (newCategory: string) => {
    dish.addCategory(newCategory);
  };

  // Вместо deleteCategory используйте:
  const deleteCategory = (categoryName: string) => {
    dish.deleteCategoryLocal(categoryName);
  };

  // Вместо addProduct используйте:
  const addProduct = (categoryName: string) => {
    dish.addProduct(categoryName);
  };

  // Вместо deleteProduct используйте:
  const deleteProduct = (categoryName: string, productId: number) => {
    dish.deleteProduct(categoryName, productId);
  };

  // Вместо updateDishData используйте:
  const updateDishData = useCallback((categoryName: string, productId: number, updatedDishData: any) => {
    dish.updateProduct(categoryName, productId, updatedDishData);
  }, [dish]);

  // Вместо handleCategorySave используйте:
  const handleCategorySave = (oldCategoryName: string, newCategoryName: string) => {
    dish.updateCategoryName(oldCategoryName, newCategoryName);
    setEditingCategory(null);
  };
  // КОНЕЦ ФУНКЦИЙ ДЛЯ ПРОДУКТОВ

  // ЗАМЕНИТЕ функции для номеров:

  // Вместо toggleIsActiveRoom используйте:
  const toggleIsActiveRoom = (roomId: number) => {
    hotel.toggleRoomActiveLocal(roomId);
  };

  // Вместо updateRoomData используйте:
  const updateRoomData = useCallback((roomId: number, updatedRoomData: any) => {
    hotel.updateRoomLocal(roomId, updatedRoomData);
  }, [hotel]);

  // Добавьте функцию для добавления номера:
  const addRoom = () => {
    hotel.addRoom();
  };

  // Добавьте функцию для удаления номера:
  const deleteRoom = (roomId: number) => {
    hotel.deleteRoomLocal(roomId);
  };
  // КОНЕЦ ФУНКЦИЙ ДЛЯ НОМЕРОВ

  // ЗАМЕНИТЕ функции для вин:

  // Вместо addWine используйте:
  const addWine = (wineType: string, sweetness: string) => {
    wine.addWine(wineType, sweetness);
  };

  // Вместо deleteWine используйте:
  const deleteWine = (wineType: string, sweetness: string, wineId: number) => {
    wine.deleteWineLocal(wineType, sweetness, wineId);
  };

  // Вместо updateWineData используйте:
  const updateWineData = useCallback((wineType: string, sweetness: string, wineId: number, updatedWineData: any) => {
    wine.updateWineLocal(wineType, sweetness, wineId, updatedWineData);
  }, [wine]);
  // КОНЕЦ ФУНКЦИЙ ДЛЯ ВИН

  const pageContentHandlers = {
    "Главная": (page) => (
      <ExtCard
        Card={() => (
          <a href="#" className="font-medium text-main_theme hover:underline dark:text-cyan-500">
            Править
          </a>
        )}
        ExtContent={() => (
          <HomeEdit
            pageData={page.content}
            onContentChange={(sectionName, updatedData) =>
              updatePageContent(page.name, sectionName, updatedData)
            }
          />
        )}
      />
    ),
    "Винодельня": (page) => (
      <ExtCard
        Card={() => (
          <a href="#" className="font-medium text-main_theme hover:underline dark:text-cyan-500">
            Править
          </a>
        )}
        ExtContent={() => (
          <VineryEdit
            pageData={page.content}
            onContentChange={(sectionName, updatedData) =>
              updatePageContent(page.name, sectionName, updatedData)
            }
          />
        )}
      />
    ),
    "Ресторан": () => (
      <span className="text-gray-500">
        Контент редактируется в разделе "Меню Ресторана"
      </span>
    ),
    "Мероприятия": () => (
      <span className="text-gray-500">
        Контент редактируется в разделе "Мероприятия"
      </span>
    ),
  };
  // ЗАМЕНИТЕ функцию для страниц:

  // Вместо updatePageContent используйте:
  const updatePageContent = useCallback((pageName: string, sectionName: string, updatedData: any) => {
    pageContent.updatePageContentLocal(pageName, sectionName, updatedData);
  }, [pageContent]);

  // Добавьте функцию для переключения активности страниц:
  const togglePageActive = (pageName: string) => {
    pageContent.togglePageActiveLocal(pageName);
  };
  // КОНЕЦ ФУНКЦИЙ ДЛЯ СТРАНИЦ

  if (dish.isLoading || hotel.isLoading || pageContent.isLoading || wine.isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div>Загрузка...</div>
      </div>
    );
  }
  
  // Добавьте обработку ошибок:
  if (dish.error || hotel.error || pageContent.error || wine.error) {
    return (
      <div className="h-screen flex justify-center items-center">
        {/* <div className="text-red-500">
          Ошибка загрузки: {dish.error || hotel.error || pageContent.error || wine.error}
        </div> */}
        <div className="text-red-500">
          Ошибка загрузки: {dish.error }
        </div>
        <div className="text-red-500">
          Ошибка загрузки: {hotel.error}
        </div>
        <div className="text-red-500">
          Ошибка загрузки: {pageContent.error}
        </div>
        <div className="text-red-500">
          Ошибка загрузки: {wine.error}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-no-repeat bg-cover">
      <Navbar />
      <div className="container m-auto p-4 mt-auto md:p-6 lg:p-12">
        <h1 className="text-3xl text-gray-500 font-bold mb-4 text-center">Административная панель</h1>

        <div className="flex flex-col space-y-4 pt-4">

            <ModalsCard
                Card={addType}
                ExtContent={CreateType}
            /> 
            <ModalsCard
                Card={addClase}
                ExtContent={CreateClase}
            /> 
            <ModalsCard
                Card={addProduct}
                ExtContent={CreateProduct}
            /> 
                
          </div>
        

        <Tabs aria-label="Tabs with underline" className="tabsContainer" variant="underline">
          <Tabs.Item active title="Контент на страницах" icon={FaHome}>
            <div className="overflow-x-auto">
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Название страницы</Table.HeadCell>
                  <Table.HeadCell>Статус</Table.HeadCell>
                  <Table.HeadCell>Действия</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {pageContent.pages.map((page) => (
                    <Table.Row key={page.name} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {page.name}
                      </Table.Cell>
                      <Table.Cell>{page.isActive ? "Сохранено" : "Есть изменения"}</Table.Cell>
                      <Table.Cell>
                        {pageContentHandlers[page.name] ? pageContentHandlers[page.name](page) : (
                          <span className="text-gray-500">
                            {page.content}
                          </span>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </Tabs.Item>

          <Tabs.Item title="Карточки номеров" icon={FaHotel}>
            <div className="overflow-x-auto">
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Название номера</Table.HeadCell>
                  <Table.HeadCell>Цена за ночь</Table.HeadCell>
                  <Table.HeadCell>Статус</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {hotel.rooms.map((room, index) => (
                    <Table.Row key={room.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {room.name}
                      </Table.Cell>
                      <Table.Cell>{room.price[0]?.price || 'N/A'}</Table.Cell>
                      <Table.Cell>{room.isActive ? "Активно" : "В архиве"}</Table.Cell>
                      <Table.Cell>
                        <ExtCard
                          Card={() => (
                            <a href="#" className="font-medium text-main_theme hover:underline dark:text-cyan-500">
                              Править
                            </a>
                          )}
                          ExtContent={() => (
                            <NewRoomCard
                              roomName={room.name}
                              photos={room.images}
                              properties={room.properties}
                              conviniences={room.conviniences}
                              description={room.description}
                              prices={room.price}
                              checkIn={room.checkStandart.checkIn}
                              checkOut={room.checkStandart.checkOut}
                              notes={room.notes}
                              onDataChange={(updatedData) => updateRoomData(index, updatedData)}
                            />
                          )}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <a
                          href="#"
                          onClick={() => toggleIsActiveRoom(index)}
                          className="font-medium text-main_theme hover:underline dark:text-cyan-500"
                        >
                          {room.isActive ? "В архив" : "Активировать"}
                        </a>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </Tabs.Item>

          <Tabs.Item title="Меню ресторана" icon={MdOutlineRestaurant}>
            <div className="overflow-x-auto">
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Название блюда</Table.HeadCell>
                  <Table.HeadCell>Цена</Table.HeadCell>
                  <Table.HeadCell>Действия</Table.HeadCell>
                  <Table.HeadCell>
                    <AddCategory onClick={() => addCategory("Новая категория")} />
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {dish.dishes.map(({ category, products }) => (
                    <>
                        <div className="my-5 mx-auto flex justify-center items-center gap-4 w-full" key={category}>
                          {editingCategory !== category ? (
                            <>
                              <h3 className="font-bold text-main_theme text-lg font-body">
                                {category}
                              </h3>
                              <Button
                                icon={<MdModeEdit className='h-[20px] w-[20px]' />}
                                func={() => setEditingCategory(category)}
                              />
                              <Button
                                icon={<FaTrashAlt className='h-[20px] w-[20px]' />}
                                func={() => deleteCategory(category)}
                                customBackground={"bg-[#ff6b6b]"}
                              />
                              <Button
                                icon={<IoMdAdd className='h-[20px] w-[20px]' />}
                                func={() => addProduct(category, "Новый продукт")}
                                customBackground={"bg-[#2ecc71]"}
                              />
                            </>
                          ) : (
                            <DescriptionInput
                              inputField={true}
                              horizontal={true}
                              text={category}
                              onSave={(newName) => handleCategorySave(category, newName)}
                            />
                          )}
                        </div>
                      {products.map(({ id, images, name, header, description, descriptionFull, weight, price}) => (
                        <Table.Row key={name} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {name}
                          </Table.Cell>
                          <Table.Cell>{price}</Table.Cell>
                          <Table.Cell>
                            <ExtCard
                              Card={() => (
                                <a href="#" className="font-medium text-main_theme hover:underline dark:text-cyan-500">
                                  Править
                                </a>
                              )}
                              ExtContent={() => (
                                <NewDishCard
                                  dishName={name}
                                  photos={images}
                                  price={price}
                                  description={descriptionFull}
                                  descriptionBrief={description}
                                  weight={weight}
                                  onDataChange={(updatedData) => updateDishData(category, id, updatedData)}
                                />
                              )}
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <a
                              href="#"
                              onClick={() => deleteProduct(category, name)}
                              className="font-medium text-main_theme hover:underline dark:text-cyan-500"
                            >
                              Удалить
                            </a>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </Tabs.Item>

          <Tabs.Item title="Мероприятия" icon={IoTicket}>
            Ждём встройки <span className="font-medium text-gray-800 dark:text-white">МОДУЛЯ БРОНИРОВАНИЯ</span>.
            А пока вкладка будет пустовать...Пупууууу
          </Tabs.Item>

          <Tabs.Item title="Ассортимент винодельни" icon={FaWineGlassAlt}>
          <div className="overflow-x-auto">
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Название</Table.HeadCell>
                  <Table.HeadCell>Цена</Table.HeadCell>
                  <Table.HeadCell>Действия</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {wine.wines.map(({ type, assortment }) => (
                    <>
                      <div key={type} >
                        <div className="my-5 mx-auto flex justify-center items-center gap-4 w-full">
                          <h3 className="font-bold text-main_theme text-2xl font-body">
                            {type}
                          </h3>
                        </div>
                      </div>
                      {assortment.map(({ sweetness, wines }) => (
                        <>
                        <div className="flex items-center gap-4 w-full" key={sweetness}>
                          <h4 className="font-bold text-main_theme text-base font-body">
                            {sweetness}
                          </h4>
                          <Button
                            icon={<IoMdAdd className='h-[20px] w-[20px]' />}
                            func={() => addWine(type, sweetness)}
                            customBackground={"bg-[#2ecc71]"}
                          />
                        </div>
                        {wines.map(({ id, name, images, year, alcohol, sugar, temperature, price, description }) => (
                          <Table.Row key={id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                              {name}
                            </Table.Cell>
                            <Table.Cell>{price}</Table.Cell>
                            <Table.Cell>
                              <ExtCard
                                Card={() => (
                                  <a href="#" className="font-medium text-main_theme hover:underline dark:text-cyan-500">
                                    Править
                                  </a>
                                )}
                                ExtContent={() => (
                                  <NewWineCard
                                    dishName={name}
                                    photos={images}
                                    price={price}
                                    description={description}
                                    year={year}
                                    alcohol={alcohol}
                                    sugar={sugar}
                                    temperature={temperature}
                                    onDataChange={(updatedData) => updateWineData(type, sweetness, id, updatedData)}
                                  />
                                )}
                              />
                            </Table.Cell>
                            <Table.Cell>
                              <a
                                href="#"
                                onClick={() => deleteWine(type, sweetness, id)}
                                className="font-medium text-main_theme hover:underline dark:text-cyan-500"
                              >
                                Удалить
                              </a>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </>
                      ))}
                    </>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </Tabs.Item>
        </Tabs>
      </div>
    </div>
  );
});

export default AdminPage;