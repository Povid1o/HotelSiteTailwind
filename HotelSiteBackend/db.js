const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect:'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
    }
);

let products = [
    { id: 1, name: "Вино красное", price: 1200, description: "Сухое красное вино" },
    { id: 2, name: "Сыр козий", price: 800, description: "Фермерский продукт" },
];

module.exports = { sequelize, products };
