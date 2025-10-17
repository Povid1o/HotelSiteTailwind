
const { Sequelize } = require('sequelize');

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 5432);
const DB_NAME = process.env.DB_NAME || 'HotelSite';
const DB_USER = process.env.DB_USER || 'postgres';

const DB_PASS = String(
  process.env.DB_PASS ?? process.env.DB_PASSWORD ?? ''
);

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;
