import React, { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import HomeEdit from './components/pages_editable/HomeEdit';
import CreateClase from './components/modals/CreateClase';
import CreateType from './components/modals/СreateType';
import ModalsCard from './components/modals/ModalsCard';
import Card from './components/cards/Card';
import CreateProduct from './components/modals/CreateProduct';
import NewRoomCard from './components/modals/NewRoomCard';
import NewDishCard from './components/modals/NewDishCard';
import ExtCard from './components/cards/ExtCard';
import DescriptionInput from './components/text_inputs/DescriptionInput';
import Button from './components/text_inputs/Button';
import { Tabs } from "flowbite-react";
import { Table } from "flowbite-react";
import "./AdminPage.css";

import Bottle from './components/assets/wine-bottle.png';
import Calendar from './components/assets/calendar.png';
import Excursion from './components/assets/excursion.png';
import Running from './components/assets/running.png';

import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { FaTrashAlt } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { IoTicket } from "react-icons/io5";
import { FaWineGlassAlt } from "react-icons/fa";
import { FaHotel } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { MdOutlineRestaurant, MdModeEdit } from "react-icons/md";

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

function AdminPage() {
  const [dishes, setDishes] = useState([
    {
      category: "Antipasti",
      products: [
        {
          id: 1,
          name: "Bruschetta",
          images: ["https://i.imgur.com/GuUbM8Q.png",...initialImages],
          header: "Bruschetta",
          description: "Very delicious slice of bread with vegetables",
          descriptionFull: "Our Bruschetta features toasted artisanal bread topped with ripe tomatoes, fresh basil, and garlic. Drizzled with extra virgin olive oil, it's a perfect balance of flavors and textures.",
          weight: "150g",
          price: 8.99,
        },
        {
          id: 2,
          name: "Caprese Salad",
          images: ["https://i.imgur.com/44wBlh1.png",...initialImages],
          header: "Caprese Salad",
          description: "What Salad could be more Italian, than Caprese?",
          descriptionFull: "Our Caprese Salad showcases layers of fresh mozzarella, ripe tomatoes, and fragrant basil leaves. Finished with a drizzle of balsamic glaze and extra virgin olive oil, it's a refreshing start to any meal.",
          weight: "200g",
          price: 10.99,
        },
      ],
    },
    {
      category: "Primi Platti",
      products: [
        {
          id: 3,
          name: "Spaghetti Carbonara",
          images: ["https://i.imgur.com/jJBWmPu.png",...initialImages],
          header: "Spaghetti Carbonara",
          description: "Well, that's now the most italian thing here",
          descriptionFull: "Our Spaghetti Carbonara is a classic Roman dish made with al dente pasta, crispy pancetta, eggs, and Pecorino Romano cheese. Finished with freshly ground black pepper, it's rich, creamy, and utterly satisfying.",
          weight: "300g",
          price: 14.99,
        },
        {
          id: 4,
          name: "Risotto ai Funghi",
          images: ["https://i.imgur.com/NflqYmH.png",...initialImages],
          header: "Risotto ai Funghi",
          description: "You probably gonna like it",
          descriptionFull: "Our Risotto ai Funghi is a creamy Arborio rice dish cooked with a medley of wild mushrooms, white wine, and Parmigiano-Reggiano. Finished with a drizzle of truffle oil, it's a luxurious and comforting Italian classic.",
          weight: "280g",
          price: 16.99,
        },
      ],
    },
    {
      category: "Soups",
      products: [
        {
          id: 5,
          name: "Borsch",
          images: ["https://i.imgur.com/4VIMe45.png",...initialImages],
          header: "Borsch",
          description: "For the most patriotic ppl",
          descriptionFull: "Our Borsch is a hearty Eastern European soup featuring tender beef, beets, cabbage, and other vegetables. Served with a dollop of sour cream and fresh dill, it's a comforting and flavorful dish perfect for cold days.",
          weight: "400ml",
          price: 9.99,
        },
        {
          id: 6,
          name: "Unnamed thing",
          images: ["https://i.imgur.com/PraiyRI.png",...initialImages],
          header: "Dunno what's it",
          description: "I mean...I really dunno",
          descriptionFull: "This mysterious soup is a chef's special creation, featuring a unique blend of seasonal ingredients. With a rich broth and surprising textures, it's an adventurous choice for curious diners looking to expand their culinary horizons.",
          weight: "350ml",
          price: 12.99,
        },
      ],
    },
  ]);

  const [hotelRooms, setRooms] = useState([
    {
      name: "Стандарт",
      images: [...initialImages],
      properties: ["бассейн", "душ", "батарея", "не знаю"],
      conviniences: ["никто не бьёт", "не знаю"],
      description: "Удобный стандартный номер со всеми необходимыми удобствами",
      price: [{ title: 'ночь', price: '10000' }, { title: 'неделя', price: '50000' }],
      checkStandart: { checkIn: "14:00", checkOut: "12:00" },
      notes: ["Курение запрещено", "Животные не допускаются"],
      isActive: true,
    },
    {
      name: "Стандарт+",
      images: [...initialImages],
      properties: ["бассейн", "душ", "батарея", "не знаю"],
      conviniences: ["никто не бьёт", "не знаю"],
      description: "Улучшенный стандартный номер с дополнительными удобствами",
      price: [{ title: 'ночь', price: '20000' }, { title: 'неделя', price: '100000' }],
      checkStandart: { checkIn: "14:00", checkOut: "12:00" },
      notes: ["Завтрак включен", "Поздний выезд возможен"],
      isActive: true,
    },
  ]);

  const [pagesList, setPages] = useState([
    { name: "Главная", path: "/", isActive: true },
    { name: "Ресторан", path: "/Ресторан", isActive: true },
    { name: "Винодельня", path: "/Винодельня", isActive: true },
    { name: "Мероприятия", path: "/Мероприятия", isActive: true },
  ]);

  // Состояние для отслеживания режима редактирования категорий
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const addCategory = (newCategory) => {
    const existingCategories = dishes.filter(dish => 
      dish.category === newCategory || dish.category.startsWith(`${newCategory} (`)
    );
  
    if (existingCategories.length === 0) {
      setDishes([...dishes, { category: newCategory, products: [] }]);
      return;
    }
  
    const existingNumbers = existingCategories.map(dish => {
      const match = dish.category.match(/\((\d+)\)$/);
      return match ? parseInt(match[1]) : 0; // 0 для базовой категории без номера
    });
  
    const maxNumber = Math.max(...existingNumbers);
    
    const finalCategory = `${newCategory} (${maxNumber + 1})`;
    
    setDishes([...dishes, { category: finalCategory, products: [] }]);
  };

  const deleteCategory = (categoryName) => {
    setDishes(dishes.filter(category => category.category !== categoryName));
  };

  const addProduct = (categoryName) => {
    const newProduct = {
      id: Date.now(),
      name: "Новый продукт",
      images: [],
      header: "Новый продукт",
      description: "",
      descriptionFull: "",
      weight: "",
      price: 0,
    };
    setDishes(dishes.map(category => {
      if (category.category === categoryName) {
        return {
          ...category,
          products: [...category.products, newProduct],
        };
      }
      return category;
    }));
  };

  const deleteProduct = (categoryName, productName) => {
    setDishes(dishes.map(category => {
      if (category.category === categoryName) {
        return {
          ...category,
          products: category.products.filter(product => product.name !== productName),
        };
      }
      return category;
    }));
  };

  const toggleIsActiveRoom = (index) => {
    setRooms(prevRooms =>
      prevRooms.map((room, i) =>
        i === index ? { ...room, isActive: !room.isActive } : room
      )
    );
  };

  const updateRoomData = useCallback((index, updatedRoomData) => {
    console.log('AdminPage: updating room data for index', index, updatedRoomData);
    setRooms(prevRooms => {
      const newRooms = [...prevRooms];
      newRooms[index] = {
        ...newRooms[index],
        ...updatedRoomData,
        price: updatedRoomData.price || newRooms[index].price,
        checkStandart: {
          checkIn: updatedRoomData.checkIn || newRooms[index].checkStandart.checkIn,
          checkOut: updatedRoomData.checkOut || newRooms[index].checkStandart.checkOut,
        },
        images: updatedRoomData.images || newRooms[index].images,
      };
      console.log('AdminPage: room updated', newRooms[index]);
      return newRooms;
    });
  }, []);

  // Функция для обновления данных блюда
  const updateDishData = useCallback((categoryName, productId, updatedDishData) => {
    console.log('AdminPage: updating dish data for category', categoryName, 'product id', productId, updatedDishData);
    setDishes(prevDishes => {
      return prevDishes.map(category => {
        if (category.category === categoryName) {
          return {
            ...category,
            products: category.products.map(product => {
              if (product.id === productId) {
                return {
                  ...product,
                  ...updatedDishData,
                  images: updatedDishData.images || product.images,
                };
              }
              return product;
            })
          };
        }
        return category;
      });
    });
  }, []);

  // Функция для сохранения нового названия категории
  const handleCategorySave = (oldCategoryName: string, newCategoryName: string) => {
    setDishes(dishes.map(category => {
      if (category.category === oldCategoryName) {
        return { ...category, category: newCategoryName };
      }
      return category;
    }));
    setEditingCategory(null);
  };

  return (
    <div className="h-screen flex flex-col bg-no-repeat bg-cover">
      <Navbar />
      <div className="container m-auto p-4 mt-auto md:p-6 lg:p-12">
        <h1 className="text-3xl text-white font-bold mb-4 text-center">Административная панель</h1>
        <div className="flex flex-col space-y-4 pt-4">
          {/* <ModalsCard Card={addType} ExtContent={CreateType} />
          <ModalsCard Card={addClase} ExtContent={CreateClase} />
          <ModalsCard Card={addProduct} ExtContent={CreateProduct} /> */}
        </div>

        <Tabs aria-label="Tabs with underline" className="tabsContainer" variant="underline">
          <Tabs.Item active title="Контент на страницах" icon={FaHome}>
            <div className="overflow-x-auto">
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Название страницы</Table.HeadCell>
                  <Table.HeadCell>Статус</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {pagesList.map(({ name, path, isActive }) => (
                    <Table.Row key={name} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {name}
                      </Table.Cell>
                      <Table.Cell>{isActive ? "Сохранено" : "Есть изменения"}</Table.Cell>
                      <Table.Cell>
                        <ExtCard
                          Card={() => (
                            <a href="#" className="font-medium text-main_theme hover:underline dark:text-cyan-500">
                              Править
                            </a>
                          )}
                          ExtContent={() => <HomeEdit />}
                        />
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
                  {hotelRooms.map((room, index) => (
                    <Table.Row key={room.name} className="bg-white dark:border-gray-700 dark:bg-gray-800">
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
                  {dishes.map(({ category, products }) => (
                    <>
                      <div>
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
            This is <span className="font-medium text-gray-800 dark:text-white">Contacts tab's associated content</span>.
            Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
            control the content visibility and styling.
          </Tabs.Item>

          <Tabs.Item title="Ассортимент винодельни" icon={FaWineGlassAlt}>
            This is <span className="font-medium text-gray-800 dark:text-white">Contacts tab's associated content</span>.
            Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
            control the content visibility and styling.
          </Tabs.Item>
        </Tabs>
      </div>
    </div>
  );
}

export default AdminPage;