// Нужно
import React, { useState, useCallback, useContext, useEffect } from 'react';
import { fetchVideos, createVideo, updateVideo, deleteVideo, Video } from "../src/components/http/videoAPI.tsx";

import Navbar from './components/Navbar';
import HomeEdit from './components/pages_editable/HomeEdit';
import VineryEdit from './components/pages_editable/VineryEdit';
import Card from './components/cards/Card';
import axios from "axios";

// import product from "./storage/ProductStorage.tsx"

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


import {fetchProducts, createProduct, updateProduct, deleteProduct, Product} from "./components/http/productAPI";

// Нужно
// (можно будет удалить, когда вставим бэк)
import Bottle from './components/assets/wine-bottle.png';
import Calendar from './components/assets/calendar.png';
import Excursion from './components/assets/excursion.png';
import Running from './components/assets/running.png';
// (можно будет удалить, когда вставим бэк)
// начало фоток для страниц(можно будет удалить, когда вставим бэк)
import VectorImage from './components/assets/Vector1.png';
import ThreeBottles from './components/assets/ThreeBottles.png';
import WineCaps from './components/assets/WineCaps.png';
import BottleTransparent from './components/assets/BottleTransparent.png';
import BottleTransparentHorizontal from './components/assets/BottleTransparentHorizontal.png';
import WineReservour from './components/assets/WineReservour.png';
import WineBarrel from './components/assets/WineBarrel.png';
import Grape from './components/assets/Grape.png';
import BottleProduce from './components/assets/BottleProduce.png';
import GrapeLines from './components/assets/GrapeLines.jpg';
import BackgroundImage from './images/Wine_Background2_AI.png';
// конец фоток для страниц(можно будет удалить, когда вставим бэк)
// Нужно
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
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
  // let product = new product()
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<{ name: string; price: number }>({
    name: "",
    price: 0,
  });
  const [newProductData, setNewProductData] = useState<{ name: string; price: number }>({ name: '', price: 0 });

  const context = useContext(Context);
  if (!context) {
    throw new Error('AdminPage must be used within Context Provider');
  }
  const { dish, hotel, pageContent, wine, product } = context;

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
          // @ts-ignore
          message: error.message,
          // @ts-ignore
          stack: error.stack,
          // @ts-ignore
          response: error.response?.data,
          // @ts-ignore
          status: error.response?.status,
          // @ts-ignore
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
          // @ts-ignore
          message: error.message,
          // @ts-ignore
          stack: error.stack,
          // @ts-ignore
          response: error.response?.data,
          // @ts-ignore
          status: error.response?.status,
          // @ts-ignore
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

      try {
        console.log('Загружаем продукты...');
        await product.loadProducts();
        console.log('✅ Продукты загружены:', product.products);
      } catch (error) {
        console.error('❌ Ошибка загрузки продуктов:', error);
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
  }, [dish, hotel, pageContent, wine, product]);

  const useVideos = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(false);

    const loadVideos = async () => {
      setLoading(true);
      try {
        const data = await fetchVideos();
        setVideos(data);
      } finally {
        setLoading(false);
      }
    };

    const addVideo = async (video: Omit<Video, "id">) => {
      const newVideo = await createVideo(video);
      setVideos(prev => [...prev, newVideo]);
    };

    const editVideo = async (id: number, video: Partial<Video>) => {
      const updated = await updateVideo(id, video);
      setVideos(prev => prev.map(v => (v.id === id ? updated : v)));
    };

    const removeVideo = async (id: number) => {
      await deleteVideo(id);
      setVideos(prev => prev.filter(v => v.id !== id));
    };

    useEffect(() => {
      loadVideos();
    }, []);

    return { videos, loading, addVideo, editVideo, removeVideo };
  };
  const { videos, loading, addVideo, editVideo, removeVideo } = useVideos();
  const [editingVideoId, setEditingVideoId] = useState<number | null>(null);
  const [editingVideoData, setEditingVideoData] = useState<{ [key: number]: { title: string; description: string; videoUrl: string } }>({});

  const [newVideoData, setNewVideoData] = useState<{ title: string; description: string; videoUrl: string }>({
    title: '',
    description: '',
    videoUrl: '',
  });

  // Состояние для отслеживания режима редактирования категорий
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  // ЗАМЕНИТЕ функции для блюд:
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

  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    // @ts-ignore
    fetchProducts().then(setProducts).catch(console.error);
  }, []);

  const handleAddProduct = async () => {
    try {
      const newProduct = await createProduct({ name: "Новый продукт", price: 1000 });
      setProducts([...products, newProduct]);
    } catch (e) {
      console.error("Ошибка создания продукта:", e);
    }
  };

  // Обновление продукта
  const handleUpdateProduct = async (id: number, updatedData: any) => {
    try {
      const updated = await updateProduct(id, updatedData);
      setProducts(products.map(p => (p.id === id ? updated : p)));
    } catch (e) {
      console.error("Ошибка обновления продукта:", e);
    }
  };

  // Удаление продукта
  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (e) {
      console.error("Ошибка удаления продукта:", e);
    }
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
        <div className="text-red-500">
          Ошибка загрузки: {dish.error || hotel.error || pageContent.error || wine.error}
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
                  {/* Существующие продукты */}
                  {Array.isArray(products) && products.map(({ id, name, price }) => (
                      <Table.Row key={id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          {editingProduct === id ? (
                              <input
                                  type="text"
                                  value={editingData.name}
                                  onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                                  className="border rounded p-1 w-full"
                              />
                          ) : (
                              name
                          )}
                        </Table.Cell>

                        <Table.Cell>
                          {editingProduct === id ? (
                              <input
                                  type="number"
                                  value={editingData.price}
                                  onChange={(e) => setEditingData({ ...editingData, price: +e.target.value })}
                                  className="border rounded p-1 w-20"
                              />
                          ) : (
                              price
                          )}
                        </Table.Cell>

                        <Table.Cell>
                          {editingProduct === id ? (
                              <>
                                <button
                                    onClick={async () => {
                                      await product.updateProduct(id, editingData);
                                      setEditingProduct(null);
                                    }}
                                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                                >
                                  Сохранить
                                </button>
                                <button
                                    onClick={() => setEditingProduct(null)}
                                    className="bg-gray-400 text-white px-2 py-1 rounded"
                                >
                                  Отмена
                                </button>
                              </>
                          ) : (
                              <button
                                  onClick={() => {
                                    setEditingProduct(id);
                                    setEditingData({ name, price });
                                  }}
                                  className="font-medium text-main_theme hover:underline dark:text-cyan-500"
                              >
                                Редактировать
                              </button>
                          )}
                        </Table.Cell>

                        <Table.Cell>
                          <button
                              onClick={() => product.deleteProduct(id)}
                              className="font-medium text-main_theme hover:underline dark:text-cyan-500"
                          >
                            Удалить
                          </button>
                        </Table.Cell>
                      </Table.Row>
                  ))}

                  {/* Нижний инпут для нового продукта */}
                  <Table.Row className="bg-gray-100 dark:bg-gray-800">
                    <Table.Cell>
                      <input
                          type="text"
                          value={newProductData.name}
                          onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })}
                          placeholder="Название нового продукта"
                          className="border rounded p-1 w-full"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <input
                          type="number"
                          value={newProductData.price}
                          onChange={(e) => setNewProductData({ ...newProductData, price: +e.target.value })}
                          placeholder="Цена"
                          className="border rounded p-1 w-20"
                      />
                    </Table.Cell>
                    <Table.Cell colSpan={2}>
                      <button
                          onClick={async () => {
                            try {
                              const response = await axios.post<Product>(
                                  `${process.env.REACT_APP_API_URL}api/product`,
                                  newProductData,
                                  {
                                    headers: { "x-admin-key": "secret123" }
                                  }
                              );
                              product.setProducts([...product.products, response.data]);
                              setNewProductData({ name: '', price: 0 }); // Очистка инпута после добавления
                            } catch (e) {
                              console.error("Ошибка создания продукта:", e);
                            }
                          }}
                          className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Добавить
                      </button>

                      <button
                          onClick={() => setNewProductData({ name: '', price: 0 })}
                          className="bg-gray-400 text-white px-2 py-1 rounded"
                      >
                        Отмена
                      </button>
                    </Table.Cell>
                  </Table.Row>
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
                      {Array.isArray(products) ? products.map(({ id, images, name, header, description, descriptionFull, weight, price}) => (
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
                      )) : <div></div> }
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
                  {Array.isArray(wine) && wine.wines.map(({ type, assortment }) => (
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

          <Tabs.Item title="Продукты" icon={HiClipboardList}>
            <div className="overflow-x-auto">
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Название</Table.HeadCell>
                  <Table.HeadCell>Цена</Table.HeadCell>
                  <Table.HeadCell>Действия</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {products.map((product) => (
                      <Table.Row key={product.id}>
                        <Table.Cell>{product.name}</Table.Cell>
                        <Table.Cell>{product.price}</Table.Cell>
                        <Table.Cell>
                          <button onClick={() =>{
                            handleUpdateProduct(product.id, { name: product.name + " (обновлено)"})
                            setEditingProduct(product.id);
                            setEditingData({ name: product.name, price: product.price })
                          }}>
                            Редактировать
                          </button>
                          <button onClick={() => handleDeleteProduct(product.id)}>Удалить</button>
                        </Table.Cell>
                      </Table.Row>

                  ))}

                </Table.Body>
              </Table>
              <button onClick={handleAddProduct} className="mt-4 bg-main_theme text-white px-4 py-2 rounded-xl">
                Добавить продукт
              </button>
            </div>
          </Tabs.Item>

          <Tabs.Item title="Видео" icon={FaHome}>
            <div className="overflow-x-auto">
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Название</Table.HeadCell>
                  <Table.HeadCell>Описание</Table.HeadCell>
                  <Table.HeadCell>Ссылка на видео</Table.HeadCell>
                  <Table.HeadCell>Действия</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">

                  {/* Существующие видео */}
                  {videos.map((video) => {
                    return (
                        <Table.Row key={video.id}>
                          <Table.Cell>
                            {editingVideoId === video.id ? (
                                <input
                                    type="text"
                                    value={editingVideoData[video.id]?.title || ""}
                                    onChange={(e) =>
                                        setEditingVideoData(prev => ({
                                          ...prev,
                                          [video.id]: {...prev[video.id], title: e.target.value}
                                        }))
                                    }
                                    className="border rounded p-1 w-full"
                                />
                            ) : (
                                video.title
                            )}
                          </Table.Cell>
                          <Table.Cell>
                            {editingVideoId === video.id ? (
                                <input
                                    type="text"
                                    value={editingVideoData[video.id]?.description || ""}
                                    onChange={(e) =>
                                        setEditingVideoData(prev => ({
                                          ...prev,
                                          [video.id]: {...prev[video.id], description: e.target.value}
                                        }))
                                    }
                                    className="border rounded p-1 w-full"
                                />
                            ) : (
                                video.description
                            )}
                          </Table.Cell>
                          <Table.Cell>
                            {editingVideoId === video.id ? (
                                <input
                                    type="text"
                                    value={editingVideoData[video.id]?.videoUrl || ""}
                                    onChange={(e) =>
                                        setEditingVideoData(prev => ({
                                          ...prev,
                                          [video.id]: {...prev[video.id], videoUrl: e.target.value}
                                        }))
                                    }
                                    className="border rounded p-1 w-full"
                                />
                            ) : (
                                video.videoUrl
                            )}
                          </Table.Cell>
                          <Table.Cell>
                            {editingVideoId === video.id ? (
                                <>
                                  <button
                                      onClick={async () => {
                                        await editVideo(video.id, editingVideoData[video.id]);
                                        setEditingVideoId(null);
                                      }}
                                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                                  >
                                    Сохранить
                                  </button>
                                  <button
                                      onClick={() => setEditingVideoId(null)}
                                      className="bg-gray-400 text-white px-2 py-1 rounded"
                                  >
                                    Отмена
                                  </button>
                                </>
                            ) : (
                                <>
                                  <button
                                      onClick={() => {
                                        setEditingVideoId(video.id);
                                        setEditingVideoData(prev => ({
                                          ...prev,
                                          [video.id]: {
                                            title: video.title,
                                            description: video.description,
                                            videoUrl: video.videoUrl,
                                          }

                                        }));
                                        console.log("render", video.id, editingVideoId, editingVideoId === video.id)
                                      }}

                                      className="font-medium text-main_theme hover:underline dark:text-cyan-500 mr-2"
                                  >
                                    Редактировать
                                  </button>
                                  <button
                                      onClick={() => removeVideo(video.id)}
                                      className="font-medium text-red-500 hover:underline"
                                  >
                                    Удалить
                                  </button>
                                </>
                            )}
                          </Table.Cell>
                        </Table.Row>
                    )}
                  )
                  }

                  {/* Нижний инпут для нового видео */}
                  <Table.Row className="bg-gray-100 dark:bg-gray-800">
                    <Table.Cell>
                      <input
                          type="text"
                          value={newVideoData.title}
                          onChange={(e) => setNewVideoData({ ...newVideoData, title: e.target.value })}
                          placeholder="Название видео"
                          className="border rounded p-1 w-full"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <input
                          type="text"
                          value={newVideoData.description}
                          onChange={(e) => setNewVideoData({ ...newVideoData, description: e.target.value })}
                          placeholder="Описание"
                          className="border rounded p-1 w-full"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <input
                          type="text"
                          value={newVideoData.videoUrl}
                          onChange={(e) => setNewVideoData({ ...newVideoData, videoUrl: e.target.value })}
                          placeholder="Ссылка на видео"
                          className="border rounded p-1 w-full"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <button
                          onClick={async () => {
                            await addVideo(newVideoData);
                            setNewVideoData({ title: '', description: '', videoUrl: '' }); // очистка
                          }}
                          className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Добавить
                      </button>
                      <button
                          onClick={() => setNewVideoData({ title: '', description: '', videoUrl: '' })}
                          className="bg-gray-400 text-white px-2 py-1 rounded"
                      >
                        Отмена
                      </button>
                    </Table.Cell>
                  </Table.Row>
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