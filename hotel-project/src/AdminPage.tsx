// Нужно
import React, { useState, useCallback, useContext, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeEdit from './components/pages_editable/HomeEdit';
import { HomePageData, GalleryImage } from './components/pages_editable/HomeEdit';
import RestaurantEdit from './components/pages_editable/RestaurantEdit';
import V4InfoPageEdit from './components/pages_editable/V4InfoPageEdit';
import V4HeroEdit from './components/pages_editable/V4HeroEdit';
import PagePreviewCard from './components/pages_editable/PagePreviewCard';
import { EditableImageValue } from './components/editable/EditableImageSlot';
import Card from './components/cards/Card';

import ModalsCard from './components/modals/ModalsCard'

import { Context } from './index';
import { observer } from 'mobx-react-lite';

import NewRoomCard from './components/modals/NewRoomCard';
import NewDishCard from './components/modals/NewDishCard';
import NewWineCard from './components/modals/NewWineCard';
import ExtCard from './components/cards/ExtCard';
import DescriptionInput from './components/text_inputs/DescriptionInput';
import Button from './components/text_inputs/Button';
import PhotoSelector from './components/text_inputs/PhotoSelector';
import { Tabs } from "flowbite-react";
import { Table } from "flowbite-react";
import "./AdminPage.css";
import AdminStatusBadge from './components/AdminStatusBadge';
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

type ContentRecord = Record<string, unknown>;
type AdminEditablePage = { id: number; name: string; path: string; content: unknown };
type PreviewData = { title: string; description: string; image: EditableImageValue; type: 'hero' | 'document' };

const asContentRecord = (value: unknown): ContentRecord => typeof value === 'object' && value !== null && !Array.isArray(value) ? value as ContentRecord : {};
const textValue = (value: unknown, fallback = ''): string => typeof value === 'string' ? value : fallback;
const imageValue = (value: unknown): EditableImageValue => typeof value === 'string' || value instanceof File ? value : null;
const sectionRecord = (content: ContentRecord, section: string): ContentRecord => asContentRecord(content[section]);
const galleryImages = (value: unknown): GalleryImage[] => Array.isArray(value) ? value.map(item => {
  const image = asContentRecord(item);
  return { src: imageValue(image.src ?? item), alt: textValue(image.alt) };
}) : [];

const homeEditorData = (content: ContentRecord): HomePageData => {
  const hero = sectionRecord(content, 'mainBackground');
  const about = sectionRecord(content, 'aboutSection');
  const firstGallery = sectionRecord(content, 'firstGallery');
  const secondGallery = sectionRecord(content, 'secondGallery');
  return {
    mainBackground: { title: textValue(hero.title), description: textValue(hero.description), image: imageValue(hero.image) },
    aboutSection: { title: textValue(about.title), description: textValue(about.description) },
    firstGallery: { title: textValue(firstGallery.title), images: galleryImages(firstGallery.images) },
    secondGallery: { title: textValue(secondGallery.title), images: galleryImages(secondGallery.images) },
  };
};

const pagePreview = (page: AdminEditablePage): PreviewData => {
  const content = asContentRecord(page.content);
  if (page.path === '/Contacts') {
    const contacts = sectionRecord(content, 'contacts');
    return { title: textValue(contacts.title, 'Контакты'), description: textValue(contacts.address, 'Контактная информация'), image: null, type: 'document' };
  }
  if (page.path === '/Privacy') {
    const privacy = sectionRecord(content, 'privacy');
    return { title: textValue(privacy.title, 'Политика конфиденциальности'), description: textValue(privacy.eyebrow, 'Документы'), image: null, type: 'document' };
  }
  const section = page.path === '/' || page.path === '/Vinery' ? 'mainBackground' : page.path === '/Shop' ? 'shopHero' : 'hero';
  const hero = sectionRecord(content, section);
  return { title: textValue(hero.title, page.name), description: textValue(hero.description), image: imageValue(hero.image), type: 'hero' };
};

const EditPreviewCard: React.FC<{ page: AdminEditablePage }> = ({ page }) => {
  const preview = pagePreview(page);
  return <PagePreviewCard {...preview} />;
};

// Начальные изображения для комнат
const initialImages = [
  { src: Calendar, alt: 'Calendar' },
  { src: Excursion, alt: 'Excursion' },
  { src: Running, alt: 'Running' },
  { src: Bottle, alt: 'Bottle' },
];



const AddCategory = ({onClick, disabled = false}) => {
  return (
    <Card>
      <button 
        className="bg-main_theme hover:bg-rose-950 text-white font-bold py-2 px-4 rounded-xl w-48 disabled:opacity-50 disabled:cursor-not-allowed" 
        onClick={onClick}
        disabled={disabled}
      >
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
  const { dish, hotel, pageContent, wine, events } = context;

  // Состояния для защиты от повторных кликов
  const [isAddingDish, setIsAddingDish] = useState(false);
  const [isAddingWine, setIsAddingWine] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingRoom, setIsAddingRoom] = useState(false);

  useEffect(() => {
    console.log('=== AdminPage: Загрузка данных ===');
    // Загружаем данные только если они еще не загружены
    if (dish.dishes.length === 0) {
      dish.loadDishes().catch(console.error);
    }
    if (hotel.rooms.length === 0) {
      hotel.loadRooms().catch(console.error);
    }
    if (pageContent.pages.length === 0) {
      pageContent.loadPageContent().catch(console.error);
    }
    if (wine.wines.length === 0) {
      wine.loadWines().catch(console.error);
    }
    if (!events.categories.length || !events.events.length) {
      events.refreshAll().catch(console.error);
    }
  }, []); // Пустой массив зависимостей - загружаем только при монтировании

  // НАЧАЛО ФУНКЦИЙ ДЛЯ ПРОДУКТОВ

  // Состояние для отслеживания режима редактирования категорий
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  
  // Состояния для мероприятий
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEventCategory, setEditingEventCategory] = useState<number | null>(null);


  // Вместо addCategory используйте:
  const addCategory = async (newCategory: string) => {
    if (isAddingCategory) return; // Защита от повторных кликов
    
    setIsAddingCategory(true);
    await dish.addCategory(newCategory);
    
    setTimeout(() => {
      setIsAddingCategory(false);
    }, 500); // Задержка 500ms
  };

  // Вместо deleteCategory используйте:
  const deleteCategory = (categoryName: string) => {
    dish.deleteCategoryLocal(categoryName);
  };

  // Вместо addProduct используйте:
  const addProduct = async (categoryName: string) => {
    if (isAddingDish) return; // Защита от повторных кликов
    
    setIsAddingDish(true);
    await dish.addProduct(categoryName);
    
    setTimeout(() => {
      setIsAddingDish(false);
    }, 500); // Задержка 500ms
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
  const addRoom = async () => {
    if (isAddingRoom) return;
    setIsAddingRoom(true);
    try {
      await hotel.addRoom();
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Не удалось создать номер.');
    } finally {
      setIsAddingRoom(false);
    }
  };

  // Добавьте функцию для удаления номера:
  const deleteRoom = (roomId: number) => {
    hotel.deleteRoomLocal(roomId);
  };
  // КОНЕЦ ФУНКЦИЙ ДЛЯ НОМЕРОВ

  // ЗАМЕНИТЕ функции для вин:

  // Вместо addWine используйте:
  const addWine = async (wineType: string, sweetness: string) => {
    if (isAddingWine) return; // Защита от повторных кликов
    
    setIsAddingWine(true);
    await wine.addWine(wineType, sweetness);
    
    setTimeout(() => {
      setIsAddingWine(false);
    }, 500); // Задержка 500ms
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

  // ФУНКЦИИ ДЛЯ МЕРОПРИЯТИЙ
  const addEvent = async (categoryId: number) => {
    if (isAddingEvent) return;
    
    setIsAddingEvent(true);
    try {
      await events.createEvent({ 
        title: 'Новое мероприятие', 
        categoryId, 
        description: '', 
        images: [] 
      });
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Ошибка при создании мероприятия. Проверьте, что вы авторизованы.');
    } finally {
      setTimeout(() => {
        setIsAddingEvent(false);
      }, 500);
    }
  };

  const handleEventCategoryDescriptionSave = useCallback((categoryId: number, newDescription: string) => {
    events.updateCategory(categoryId, { description: newDescription });
    setEditingEventCategory(null);
  }, [events]);
  // КОНЕЦ ФУНКЦИЙ ДЛЯ МЕРОПРИЯТИЙ

  const pageContentHandlers: Record<string, (page: AdminEditablePage) => React.ReactNode> = {
    "Главная": (page) => (
      <ExtCard
        Card={() => <EditPreviewCard page={page} />}
        content={
          <HomeEdit
            pageData={homeEditorData(asContentRecord(page.content))}
            onContentChange={(sectionName, updatedData) =>
              updatePageContent(page.name, sectionName, updatedData)
            }
          />
        }
      />
    ),
    "Винодельня": (page) => (
      <ExtCard
        Card={() => <EditPreviewCard page={page} />}
        content={<V4HeroEdit pageTitle="Винодельня" section="mainBackground" imageLabel="Фото хедера винодельни" content={asContentRecord(page.content)} onSave={(section, data) => updatePageContent(page.name, section, data)} />}
      />
    ),
    "Витрина вина": (page) => (
      <ExtCard
        Card={() => <EditPreviewCard page={page} />}
        content={<V4HeroEdit pageTitle="Витрина вина" section="shopHero" imageLabel="Фото хедера витрины" content={asContentRecord(page.content)} onSave={(section, data) => updatePageContent(page.name, section, data)} />}
      />
    ),
    "Отель": (page) => (
      <ExtCard Card={() => <EditPreviewCard page={page} />} content={<V4HeroEdit pageTitle="Отель" imageLabel="Фото хедера отеля" content={asContentRecord(page.content)} onSave={(section, data) => updatePageContent(page.name, section, data)} />} />
    ),
    "Ресторан": (page) => <ExtCard Card={() => <EditPreviewCard page={page} />} content={<RestaurantEdit content={asContentRecord(page.content)} onSave={(section, data) => updatePageContent(page.name, section, data)} />} />,
    "Мероприятия": (page) => <ExtCard Card={() => <EditPreviewCard page={page} />} content={<V4HeroEdit pageTitle="Мероприятия" imageLabel="Фото хедера мероприятий" content={asContentRecord(page.content)} onSave={(section, data) => updatePageContent(page.name, section, data)} />} />,
    "Контакты": (page) => (
      <ExtCard
        Card={() => <EditPreviewCard page={page} />}
        content={<V4InfoPageEdit type="contacts" content={asContentRecord(page.content)} onSave={(section, data) => updatePageContent(page.name, section, data)} />}
      />
    ),
    "Политика конфиденциальности": (page) => (
      <ExtCard
        Card={() => <EditPreviewCard page={page} />}
        content={<V4InfoPageEdit type="privacy" content={asContentRecord(page.content)} onSave={(section, data) => updatePageContent(page.name, section, data)} />}
      />
    ),
    "Страница ресторана": (page) => (
      <ExtCard Card={() => <EditPreviewCard page={page} />} content={<RestaurantEdit content={asContentRecord(page.content)} onSave={(section, data) => updatePageContent(page.name, section, data)} />} />
    ),
    "Страница мероприятий": (page) => (
      <ExtCard Card={() => <EditPreviewCard page={page} />} content={<V4HeroEdit pageTitle="Мероприятия" imageLabel="Фото хедера мероприятий" content={asContentRecord(page.content)} onSave={(section, data) => updatePageContent(page.name, section, data)} />} />
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
      <AdminStatusBadge />
      <Navbar />
      <div className="container m-auto p-4 mt-auto md:p-6 lg:p-12">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl text-gray-500 font-bold">Административная панель</h1>
          {/* <button 
            onClick={() => {
              console.log('Принудительное обновление данных...');
              dish.loadDishes();
              hotel.loadRooms();
              pageContent.loadPageContent();
              wine.loadWines();
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Обновить данные
          </button> */}
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
                      <Table.Cell>
                        {pageContent.isSavingPage(page.id)
                          ? "Сохраняем…"
                          : pageContent.getPageSaveError(page.id) || "Сохранено"}
                      </Table.Cell>
                      <Table.Cell>
                        {pageContentHandlers[page.name] ? pageContentHandlers[page.name]({ id: page.id, name: page.name, path: page.path, content: page.content }) : (
                          <span className="text-gray-500">
                            {String(page.content)}
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
              <div className="mb-4 flex justify-end">
                <button
                  type="button"
                  onClick={addRoom}
                  disabled={isAddingRoom}
                  className="inline-flex items-center gap-2 rounded-lg bg-main_theme px-4 py-2 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <IoMdAdd className="h-5 w-5" />
                  {isAddingRoom ? 'Создаём…' : 'Добавить номер'}
                </button>
              </div>
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
                      <Table.Cell>
                        {hotel.isSavingRoom(room.id)
                          ? "Сохраняем…"
                          : hotel.getRoomSaveError(room.id) || (room.isActive ? "Активно" : "В архиве")}
                      </Table.Cell>
                      <Table.Cell>
                          <ExtCard
                          Card={() => (
                            <button type="button" className="font-medium text-main_theme hover:underline dark:text-cyan-500">
                              Править
                            </button>
                          )}
                          content={
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
                              onDataChange={(updatedData) => updateRoomData(room.id, updatedData)}
                            />
                          }
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <a
                          href="#"
                          onClick={() => toggleIsActiveRoom(room.id)}
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
                    <AddCategory onClick={() => { addCategory("Новая категория"); }} disabled={isAddingCategory} />
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {dish.dishes.map(({ category, products }) => (
                    <React.Fragment key={category}>
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell colSpan={4}>
                          <div className="my-5 mx-auto flex justify-center items-center gap-4 w-full">
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
                                  func={() => { addProduct(category); }}
                                  customBackground={isAddingDish ? "bg-gray-400" : "bg-[#2ecc71]"}
                                  disabled={isAddingDish}
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
                        </Table.Cell>
                      </Table.Row>
                      {products.map(({ id, images, name, header, description, descriptionFull, weight, price}) => (
                        <Table.Row key={id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            <div>{name}</div>
                            {dish.isSavingProduct(id) && <div className="text-xs text-gray-500">Сохраняем…</div>}
                            {dish.getProductSaveError(id) && <div className="text-xs text-red-600">Ошибка сохранения</div>}
                          </Table.Cell>
                          <Table.Cell>{price}</Table.Cell>
                          <Table.Cell>
                            <ExtCard
                              Card={() => (
                                <button type="button" className="font-medium text-main_theme hover:underline dark:text-cyan-500">
                                  Править
                                </button>
                              )}
                              content={
                                <NewDishCard
                                  dishName={name}
                                  header={header}
                                  photos={images}
                                  price={price}
                                  description={descriptionFull}
                                  descriptionBrief={description}
                                  weight={weight}
                                  onDataChange={(updatedData) => updateDishData(category, id, updatedData)}
                                />
                              }
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <button
                              type="button"
                              onClick={() => deleteProduct(category, id)}
                              className="font-medium text-main_theme hover:underline dark:text-cyan-500"
                            >
                              Удалить
                            </button>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </React.Fragment>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </Tabs.Item>

          <Tabs.Item title="Мероприятия" icon={IoTicket}>
            <div className="overflow-x-auto">
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Название мероприятия</Table.HeadCell>
                  <Table.HeadCell>Действия</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {events.categories.map((cat) => (
                    <React.Fragment key={cat.id}>
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell colSpan={2}>
                          <div className="my-5 mx-auto flex justify-between items-center gap-4 w-full px-4">
                            <div className="flex items-center gap-4 flex-1">
                              <h3 className="font-bold text-main_theme text-lg font-body">
                                {cat.header}
                              </h3>
                              {editingEventCategory === cat.id ? (
                                <div className="flex-1">
                                  <DescriptionInput
                                    text={cat.description}
                                    inputField={true}
                                    horizontal={false}
                                    onSave={(newDesc) => handleEventCategoryDescriptionSave(cat.id, newDesc)}
                                  />
                                </div>
                              ) : (
                                <span 
                                  className="text-gray-600 text-sm cursor-pointer hover:text-gray-800 flex-1"
                                  onClick={() => setEditingEventCategory(cat.id)}
                                  title="Нажмите для редактирования"
                                >
                                  {cat.description}
                                </span>
                              )}
                            </div>
                            <Button
                              text=""
                              icon={<IoMdAdd className='h-[20px] w-[20px]' />}
                              func={() => addEvent(cat.id)}
                              customBackground={isAddingEvent ? "bg-gray-400" : "bg-[#2ecc71]"}
                              disabled={isAddingEvent}
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      {(cat.events || []).map((ev) => (
                        <Table.Row key={ev.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            <div>{ev.title}</div>
                            {events.isSavingEvent(ev.id) && <div className="text-xs text-gray-500">Сохраняем…</div>}
                            {events.getEventSaveError(ev.id) && <div className="text-xs text-red-600">Ошибка сохранения</div>}
                          </Table.Cell>
                          <Table.Cell>
                            <ExtCard
                              Card={() => (
                                <button type="button" className="font-medium text-main_theme hover:underline dark:text-cyan-500">
                                  Править
                                </button>
                              )}
                              content={
                                <div className="p-4">
                                  <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Название:</label>
                                    <DescriptionInput
                                      text={ev.title}
                                      inputField={true}
                                      horizontal={false}
                                      onSave={(t) => events.updateEvent(ev.id, { title: t })}
                                    />
                                  </div>
                                  <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Описание:</label>
                                    <DescriptionInput
                                      text={ev.description}
                                      inputField={false}
                                      horizontal={false}
                                      onSave={(d) => events.updateEvent(ev.id, { description: d })}
                                    />
                                  </div>
                                  <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Фотографии:</label>
                                    <PhotoSelector
                                      photos={ev.images?.map(img => img.url) || []}
                                      header="Фотографии мероприятия"
                                      ButtonCard={null}
                                      withSlider={true}
                                      onPhotosChange={(newPhotos) => events.updateEvent(ev.id, { images: newPhotos })}
                                    />
                                  </div>
                                </div>
                              }
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <button
                              type="button"
                              onClick={() => events.deleteEvent(ev.id)}
                              className="font-medium text-main_theme hover:underline dark:text-cyan-500"
                            >
                              Удалить
                            </button>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </React.Fragment>
                  ))}
                </Table.Body>
              </Table>
            </div>
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
                    <React.Fragment key={type}>
                      <Table.Row>
                        <Table.Cell colSpan={4}>
                          <div className="my-5 mx-auto flex justify-center items-center gap-4 w-full">
                            <h3 className="font-bold text-main_theme text-2xl font-body">
                              {type}
                            </h3>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                      {assortment.map(({ sweetness, wines }) => (
                        <React.Fragment key={`${type}-${sweetness}`}>
                          <Table.Row>
                            <Table.Cell colSpan={4}>
                              <div className="flex items-center gap-4 w-full">
                                <h4 className="font-bold text-main_theme text-base font-body">
                                  {sweetness}
                                </h4>
                                <Button
                                  icon={<IoMdAdd className='h-[20px] w-[20px]' />}
                                  func={() => { addWine(type, sweetness); }}
                                  customBackground={isAddingWine ? "bg-gray-400" : "bg-[#2ecc71]"}
                                  disabled={isAddingWine}
                                />
                              </div>
                            </Table.Cell>
                          </Table.Row>
                          {wines.map(({ id, name, images, year, alcohol, sugar, temperature, price, description }) => (
                            <Table.Row key={id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                <div>{name}</div>
                                {wine.isSavingWine(id) && <div className="text-xs text-gray-500">Сохраняем…</div>}
                                {wine.getWineSaveError(id) && <div className="text-xs text-red-600">Ошибка сохранения</div>}
                              </Table.Cell>
                              <Table.Cell>{price}</Table.Cell>
                              <Table.Cell>
                                <ExtCard
                                  Card={() => (
                                    <button type="button" className="font-medium text-main_theme hover:underline dark:text-cyan-500">
                                      Править
                                    </button>
                                  )}
                                  content={
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
                                  }
                                />
                              </Table.Cell>
                              <Table.Cell>
                                <button
                                  type="button"
                                  onClick={() => deleteWine(type, sweetness, id)}
                                  className="font-medium text-main_theme hover:underline dark:text-cyan-500"
                                >
                                  Удалить
                                </button>
                              </Table.Cell>
                            </Table.Row>
                          ))}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
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
