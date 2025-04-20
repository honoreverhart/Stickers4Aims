const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL ||
    "postgres://Honor:Ephesians4:29@localhost:5432/stickers4aims_db"
);
const uuid = require("uuid");
const bcrypt = require("bycrpt");
const JWT = process.env.JWT || "shhh";
const jwt = require("jsonwebtoken");
require("dotenv").config();

const createTables = async () => {
    const SQL = `
        DROP TABLE IF EXISTS editStickers;
        DROP TABLE IF EXISTS stickers;
        DROP TABLE IF EXISTS users;
        CREATE TABLE users(
            id UUID PRIMARY KEY,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
        );
        CREATE TABLE stickers(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
        );
        CREATE TABLE editStickers(
            user_id UUID REFERENCES users(id) NOT NULL,
            stickers_id INTEGER REFERENCES stickers(id) NOT NULL
        );

    `
    await client.query(SQL);
}

const createUser = async({}) => {

}

const fetchUsers = async () => {

}

const createSticker = async ({}) => {

}

const fetchStickers = async ({}) => {

}

const destroySticker = async () => {

}

const editSticker = async ({}) => {

}

const authenticate = async ({}) => {

}

const findUserWithToken = async () => {

}

module.exports = {
    client,
    createTables,
    createUser,
    fetchUsers,
    createSticker,
    fetchStickers,
    destroySticker,
    editSticker,
    authenticate,
    findUserWithToken
}