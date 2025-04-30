const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL ||
    "postgres://Honor:Ephesians4:29@localhost:5432/stickers4aims_db"
);
const uuid = require("uuid");
const bcrypt = require("bcrypt");
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
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
        );
        CREATE TABLE stickers(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
        );

    `;
  await client.query(SQL);
};

const createUser = async ({ username, password }) => {
  const SQL = `
    INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *
    `;
  const response = await client.query(SQL, [
    uuid.v4(),
    username,
    await bcrypt.hash(password, 5),
  ]);
  const authResponse = await authenticate({ username, password });
  return { user: response.rows[0], token: authResponse.token };
};

const fetchUsers = async () => {
  const SQL = `
    SELECT id, username, password FROM users
    `;
  const response = await client.query(SQL);
  return response.rows;
};

const createSticker = async ({ name }) => {
  const SQL = `
    INSERT INTO stickers(name) VALUES($1) RETURNING *
    `;
  const response = await client.query(SQL, [name]);
  return response.rows[0];
};

const fetchStickers = async ({}) => {
  const SQL = `
    SELECT name FROM stickers
    `;
  const response = await client.query(SQL);
  return response.rows;
};

const destroySticker = async (id) => {
  const SQL = `
    DELETE FROM stickers WHERE id = $1
    `;
  await client.query(SQL, [id]);
};

const editSticker = async ({name, id}) => {
  const SQL = `
    UPDATE stickers
    SET name=$1 
    WHERE id=$2
    RETURNING *
    `;
    const response = await client.query(SQL, [name, id]);
    return response.rows[0];
};

const authenticate = async ({ username, password }) => {
  const SQL = `
    SELECT id, username, password FROM users WHERE username=$1
    `;
  const response = await client.query(SQL, [username]);
  if (
    !response.rows.length ||
    !(await bcrypt.compare(password, response.rows[0].password))
  ) {
    const error = Error("Sorry, username or password not authorized");
    error.status = 401;
    throw error;
  }
  response;
  const token = jwt.sign(response.rows[0], JWT);
  return { token: token, user: response.rows[0] };
};

const findUserWithToken = async (token) => {
  let id;
  try {
    const payload = jwt.verify(token, JWT);
    id = payload;
  } catch (ex) {
    const error = Error("Sorry, token not authorized");
    error.status = 401;
    throw error;
  }
};

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
  findUserWithToken,
};
