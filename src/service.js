require('dotenv').config()
const { Client } = require('pg')

const createTable = async function (tableName) {
  const client = new Client()
  await client.connect()

  return await client.query(`DROP TABLE IF EXISTS ${tableName};
    CREATE TABLE ${tableName} (id SERIAL PRIMARY KEY, text VARCHAR(40) not null);`)
}

const insert = async function (tableName, itemName) {
  const client = new Client()
  await client.connect()

  return await client.query(`INSERT INTO ${tableName} (text) VALUES ('${itemName}');`)
}

const select = async function (tableName, columns = '*') {
  const client = new Client()
  await client.connect()

  return await client.query(`SELECT ${columns} FROM ${tableName}`)
}

module.exports = {
  createTable,
  insert,
  select
}