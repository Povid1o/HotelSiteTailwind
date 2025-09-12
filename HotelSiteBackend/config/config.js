require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "root",
        database: process.env.DB_NAME || "hotel_site",
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || "5432",
        dialect: "postgres"
    }
};
