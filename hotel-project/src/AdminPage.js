import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomeEdit from './components/pages_editable/HomeEdit';
import CreateClase from './components/modals/CreateClase';
import CreateType from './components/modals/СreateType';
import ModalsCard from './components/modals/ModalsCard'
import Card from './components/Card';
import CreateProduct from './components/modals/CreateProduct';
import NewRoomCard from './components/modals/NewRoomCard';
import NewDishCard from './components/modals/NewDishCard';
import ExtCard from './components/ExtCard';
import { Tabs } from "flowbite-react";
import { Table } from "flowbite-react";
import "./AdminPage.css"


import Bottle from './components/assets/wine-bottle.png'
import Calendar from './components/assets/calendar.png'
import Excursion from './components/assets/excursion.png'
import Running from './components/assets/running.png'
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
// import { MdDashboard } from "react-icons/md";
import { IoTicket } from "react-icons/io5";
import { FaHotel } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { MdOutlineRestaurant } from "react-icons/md";

const addType = () => {
  return(
      <Card >
          <button
          className="bg-main_theme hover:bg-rose-950 text-white font-bold py-2 px-4 rounded-xl w-48"
        >
          Добавить тип
        </button>      
      </Card>

  )
}

const addClase = () => {
    return(
        <Card >
            <button
            className="bg-main_theme hover:bg-rose-950 text-white font-bold py-2 px-4 rounded-xl w-48"
          >
            Добавить Класс
          </button>      
        </Card>

    )
}

const addProduct = () => {
    return(
        <Card >
            <button
            className="bg-main_theme hover:bg-rose-950 text-white font-bold py-2 px-4 rounded-xl w-48"
          >
            Добавить Продукт
          </button>      
        </Card>

    )
}

const imagesPool = [
  { src: Calendar},
  { src: Excursion},
  { src: Running},
  { src: Bottle},
];


function AdminPage() {


  const [dishes, setDishes] = useState([
    {
      category: "Antipasti",
      products: [
        {
          img: "https://i.imgur.com/GuUbM8Q.png",
          name: "Bruschetta",
          header: "Bruschetta",
          description: "Very delicious slice of bread with vegetables",
          descriptionFull: "Our Bruschetta features toasted artisanal bread topped with ripe tomatoes, fresh basil, and garlic. Drizzled with extra virgin olive oil, it's a perfect balance of flavors and textures.",
          weight: "150g",
          price: 8.99,
          isActive: true,
        },
        {
          img: "https://i.imgur.com/44wBlh1.png",
          name: "Caprese Salad",
          header: "Caprese Salad",
          description: "What Salad could be more Italian, than Caprese?",
          descriptionFull: "Our Caprese Salad showcases layers of fresh mozzarella, ripe tomatoes, and fragrant basil leaves. Finished with a drizzle of balsamic glaze and extra virgin olive oil, it's a refreshing start to any meal.",
          weight: "200g",
          price: 10.99,
          isActive: true,
        }
      ]
    },
    {
      category: "Primi Platti",
      products: [
        {
          img: "https://i.imgur.com/jJBWmPu.png",
          name: "Spaghetti Carbonara",
          header: "Spaghetti Carbonara",
          description: "Well, that's now the most italian thing here",
          descriptionFull: "Our Spaghetti Carbonara is a classic Roman dish made with al dente pasta, crispy pancetta, eggs, and Pecorino Romano cheese. Finished with freshly ground black pepper, it's rich, creamy, and utterly satisfying.",
          weight: "300g",
          price: 14.99,
          isActive: true,
        },
        {
          img: "https://i.imgur.com/NflqYmH.png",
          name: "Risotto ai Funghi",
          header: "Risotto ai Funghi",
          description: "You probably gonna like it",
          descriptionFull: "Our Risotto ai Funghi is a creamy Arborio rice dish cooked with a medley of wild mushrooms, white wine, and Parmigiano-Reggiano. Finished with a drizzle of truffle oil, it's a luxurious and comforting Italian classic.",
          weight: "280g",
          price: 16.99,
          isActive: true,
        }
      ]
    },
    {
      category: "Soups",
      products: [
        {
          img: "https://i.imgur.com/4VIMe45.png",
          name: "Borsch",
          header: "Borsch",
          description: "For the most patriotic ppl",
          descriptionFull: "Our Borsch is a hearty Eastern European soup featuring tender beef, beets, cabbage, and other vegetables. Served with a dollop of sour cream and fresh dill, it's a comforting and flavorful dish perfect for cold days.",
          weight: "400ml",
          price: 9.99,
          isActive: true,
        },
        {
          img: "https://i.imgur.com/PraiyRI.png",
          name: "Unnamed thing",
          header: "Dunno what's it",
          description: "I mean...I really dunno",
          descriptionFull: "This mysterious soup is a chef's special creation, featuring a unique blend of seasonal ingredients. With a rich broth and surprising textures, it's an adventurous choice for curious diners looking to expand their culinary horizons.",
          weight: "350ml",
          price: 12.99,
          isActive: false,
        }
      ]
    }
  ]);

  const [hotelRooms, setRooms] = useState([

    {
      name: "Стандарт",
      properties : ["бассейн", "душ", "батарея", "не знаю"],
      conviniences : ["никто не бьёт", "не знаю"],
      price : [{ title: 'ночь', price: '10000' }, { title: 'неделя', price: '50000' }],
      checkStandart : {checkIn : "14:00", checkOut : "12:00"},
      isActive: true,
    },
  
    {
      name: "Стандарт+",
      properties : ["бассейн", "душ", "батарея", "не знаю"],
      conviniences : ["никто не бьёт", "не знаю"],
      price : [{ title: 'ночь', price: '20000' }, { title: 'неделя', price: '100000' }],
      checkStandart : {checkIn : "14:00", checkOut : "12:00"},
      isActive: true,
    }
  ])

  const [pagesList, setPages] = useState([
    {name: "Главная", path: "/", isActive: true},
    {name: "Ресторан", path: "/Ресторан", isActive: true},
    {name: "Винодельня", path: "/Винодельня", isActive: true},
    {name: "Мероприятия", path: "/Мероприятия", isActive: true},
  ])
  
  
  const toggleIsActiveProduct = (categoryName, productName) => {
    setDishes(dishes.map(category => {
      if (category.category === categoryName) {
        return {
          ...category,
          products: category.products.map(product => {
            if (product.name === productName) {
              return { ...product, isActive: !product.isActive };
            }
            return product;
          }),
        };
      }
      return category;
    }));
  };

  const toggleIsActiveRoom = (roomName) => {
    setRooms(hotelRooms.map(room => {
      if (room.name === roomName) {
        return { ...room, isActive: !room.isActive }; 
      }
      return room; 
    }));
  };



  return (
    <div className="h-screen flex flex-col bg-no-repeat bg-cover">
      <Navbar />
        <div className="container m-auto  p-4 mt-auto md:p-6 lg:p-12 ">
          <h1 className="text-3xl text-white font-bold mb-4 text-center">Административная панель</h1>
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

          <Tabs aria-label="Tabs with underline" className='tabsContainer' variant="underline">
            <Tabs.Item active title="Контент на страницах" icon={FaHome}>
            <div className="overflow-x-auto">
                <Table hoverable>

                  <Table.Head>
                    <Table.HeadCell>Название страницы</Table.HeadCell>
                    <Table.HeadCell>Статус</Table.HeadCell>
                  </Table.Head>

                  <Table.Body className="divide-y">

                    {pagesList.map(({name, link, isActive}) => (
                      <>
                        {/* <div><h3 className='my-5 mx-auto flex justify-center w-full font-bold text-main_theme text-lg font-body'>{category}</h3></div> */}
                          <Table.Row key={name} className="bg-white dark:border-gray-700 dark:bg-gray-800">

                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                              {name}
                            </Table.Cell>

                            <Table.Cell>{isActive ? "Сохранено" : "Есть изменения"}</Table.Cell>

                            <Table.Cell>
                              <ExtCard
                                Card={() => <a href="#" className="font-medium text-main_theme hover:underline dark:text-cyan-500">
                                  Править
                                </a>}
                                ExtContent={() => 
                                  <HomeEdit 
                                  />}
                                />
                            </Table.Cell>

                          </Table.Row>
                      </>

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
                    {hotelRooms.map(({name, properties, conviniences, price, checkStandart, isActive}) => (
                      <>
                        {/* <div><h3 className='my-5 mx-auto flex justify-center w-full font-bold text-main_theme text-lg font-body'>{category}</h3></div> */}
                          <Table.Row key={name} className="bg-white dark:border-gray-700 dark:bg-gray-800">

                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                              {name}
                            </Table.Cell>

                            <Table.Cell>{price[0].price}</Table.Cell>

                            <Table.Cell>{isActive ? "Активно" : "В архиве"}</Table.Cell>

                            <Table.Cell>
                              <ExtCard
                                Card={() => <a href="#" className="font-medium text-main_theme hover:underline dark:text-cyan-500">
                                  Править
                                </a>}
                                ExtContent={() => 
                                  <NewRoomCard 
                                  roomName={name} 
                                  photos={imagesPool} 
                                  properties={properties} 
                                  conviniences={conviniences} 
                                  prices={price} 
                                  checkIn={checkStandart.checkIn} 
                                  checkOut={checkStandart.checkOut}
                                  />}
                                />
                            </Table.Cell>

                            <Table.Cell>
                              <a href="#" onClick={() => toggleIsActiveRoom(name)} className="font-medium text-main_theme hover:underline dark:text-cyan-500">{isActive ? "В архив" : "Активировать"}</a>
                            </Table.Cell>
                          </Table.Row>
                      </>

                    ))}
                    
                  </Table.Body>
                </Table>
              </div>



              {/* {hotelRooms.map(({name, properties, conviniences, price, checkStandart}) => (
                <div className='mb-5'>

                  <NewRoomCard 
                    roomName={name} 
                    photos={imagesPool} 
                    properties={properties} 
                    conviniences={conviniences} 
                    prices={price} 
                    checkIn={checkStandart.checkIn} 
                    checkOut={checkStandart.checkOut}
                  />

                </div>
                
              ))} */}
            </Tabs.Item>


            <Tabs.Item title="Меню ресторана" icon={MdOutlineRestaurant}>
              <div className="overflow-x-auto">
                <Table hoverable>

                  <Table.Head>
                    <Table.HeadCell>Название блюда</Table.HeadCell>
                    <Table.HeadCell>Цена</Table.HeadCell>
                    <Table.HeadCell>Статус</Table.HeadCell>
                  </Table.Head>

                  <Table.Body className="divide-y">
                    {dishes.map(({category, products}) => (
                      <>
                        <div><h3 className='my-5 mx-auto flex justify-center w-full font-bold text-main_theme text-lg font-body'>{category}</h3></div>
                        {products.map(({img, name, header, description, descriptionFull, weight, price, isActive}) => (
                          <Table.Row key={name} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                              {name}
                            </Table.Cell>
                            <Table.Cell>{price}</Table.Cell>
                            <Table.Cell>{isActive ? "Активно" : "В архиве"}</Table.Cell>
                            <Table.Cell>
                              <ExtCard
                                Card={() => <a href="#" className="font-medium text-main_theme hover:underline dark:text-cyan-500">
                                  Править
                                </a>}
                                ExtContent={() => 
                                <NewDishCard 
                                  dishName={name} 
                                  photos={imagesPool} 
                                  price={price} 
                                  description={descriptionFull}
                                  descriptionBrief={description}
                                  weight={weight}/>}
                                />
                              
                            </Table.Cell>
                            <Table.Cell>
                              <a href="#" onClick={() => toggleIsActiveProduct(category, name)} className="font-medium text-main_theme hover:underline dark:text-cyan-500">{isActive ? "В архив" : "Активировать"}</a>
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
            
          </Tabs>

        </div>
    </div>
  );
}

export default AdminPage;