require("dotenv").config();
const mysql = require("mysql2/promise");
const { Sequelize, DataTypes } = require("sequelize");

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

async function createDatabaseIfNotExists() {
    // Connect to MySQL without specifying a database
    const connection = await mysql.createConnection({
        host: DB_HOST,
        port: DB_PORT ? parseInt(DB_PORT, 10) : 3306,
        user: DB_USER,
        password: DB_PASSWORD,
    });

    // Check if the database exists; if not, create it
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    await connection.end();
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT ? parseInt(DB_PORT, 10) : 3306,
    dialect: "mysql",
});

async function connectDB() {
    try {
        // Ensure the database is created before connecting
        await createDatabaseIfNotExists();
        await sequelize.authenticate();
        console.log("✅ Connection to MySQL has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the MySQL database:", error);
    }
}

module.exports = { connectDB, sequelize, Sequelize, DataTypes };
