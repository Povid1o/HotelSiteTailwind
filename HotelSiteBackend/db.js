// const { Sequelize } = require('sequelize');
//
// const sequelize = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,
//     {
//         dialect:'postgres',
//         host: process.env.DB_HOST,
//         port: process.env.DB_PORT,
//     }
// );

let products = [
    { id: 1, name: "Вино красное", price: 1200, description: "Сухое красное вино" },
    { id: 2, name: "Сыр козий", price: 800, description: "Фермерский продукт" },
];
let dishes = [
    { id: 1, name: "Вино красное", price: 1200, description: "Сухое красное вино" },
    { id: 2, name: "Сыр козий", price: 800, description: "Фермерский продукт" },
];
let wines = [
    { id: 1, name: "Вино красное", price: 1200, description: "Сухое красное вино" },
    { id: 2, name: "Сыр козий", price: 800, description: "Фермерский продукт" },
];

let rooms = [
    { id: 1, name: "Стандарт", price: 3500, description: "Уютный номер для двоих" },
    { id: 2, name: "Люкс", price: 7500, description: "Большой номер с видом на море" },
]
let pages = [
    { id: 1, name: "Стандарт", price: 3500, description: "Уютный номер для двоих" },
    { id: 2, name: "Люкс", price: 7500, description: "Большой номер с видом на море" },
]

let videos = [
    {
        title:'Название видео',
        description:'Описание видео. 2-3 предложения',
        spesialTitle:'text-[30px] sm:text-[45px] md:text-[50px] lg:text-[64px] font-bold',
        imageStyle:'w-[280px] h-[180px] sm:w-[450px] sm:h-[250px] md:w-[500px] md:h-[300px] lg:w-[650px] lg:h-[450px] rounded-xl ',
        specialStyle:'flex-wrap justify-center p-5',
        extraBlock:true,
        videoUrl:"https://youtu.be/LQDrTgO1pCo?si=f0SbtiZCaEX_6h0z",
    },
    {
        title:'Название видео',
        description:'Описание видео. 2-3 предложения',
        spesialTitle:'text-[30px] sm:text-[45px] md:text-[50px] lg:text-[64px] font-bold',
        imageStyle:'w-[280px] h-[180px] sm:w-[450px] sm:h-[250px] md:w-[500px] md:h-[300px] lg:w-[650px] lg:h-[450px] rounded-xl ',
        specialStyle:'flex-wrap justify-center p-5',
        extraBlock:true,
        videoUrl:"/images/Video-test.mp4",
    }
]


module.exports = { products, wines, dishes, rooms, videos }

