// require('dotenv').config()
const { Client } = require('pg')

const getConnection = () => {
  if (process.env.UNHAPPY === 'true') {
    return {
      database: 'something that will throw bad connection',
      password: 'this will result in unhappy path',
      port: 3211
    }
  } else {
    return {
      host: 'localhost',
      database: 'autoparts',
      password: null,
      port: 5432
    }
  }
}

const createTable = async function (tableName) {
  const client = new Client(getConnection())
  await client.connect()

  const res = await client.query(`DROP TABLE IF EXISTS ${tableName};
    CREATE TABLE ${tableName} (id SERIAL PRIMARY KEY, name VARCHAR(40) not null, price DECIMAL(10, 2));`)
  await client.end()
  return res
}

// for testing cleanup purposes
const dropTable = async function (tableName) {
  const client = new Client(getConnection())
  await client.connect()

  await client.query(`DROP TABLE IF EXISTS ${tableName};`)
  await client.end()
}

// ideally we'd want this function to be more general,
// but for testing demo purposes, I'm tying it to the items table context
const insert = async function (tableName, itemName, price) {
  const client = new Client(getConnection())
  await client.connect()

  const res = await client.query(`INSERT INTO ${tableName} (name, price) VALUES ('${itemName}', '${price}');`)
  await client.end()
  return res
}

const select = async function (tableName, limit = 'ALL', columns = '*') {
  const client = new Client(getConnection())
  await client.connect()

  const res = await client.query(`SELECT ${columns} FROM ${tableName} LIMIT ${limit}`)
  await client.end()
  return res
}

const selectOne = async function (tableName, itemName, columns = '*') {
  const client = new Client(getConnection())
  await client.connect()

  const res = await client.query(`SELECT ${columns} FROM ${tableName} WHERE name = '${itemName}'`)
  await client.end()
  return res
}

const createTransaction = async function (tableName, itemName, price) {
  const client = new Client(getConnection())
  await client.connect()

  try {
    await client.query('BEGIN')
    await client.query(`INSERT INTO ${tableName} (name, price) VALUES ('${itemName}', '${price}');`)
    await client.query('COMMIT')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.end()
  }
}

module.exports = {
  createTable,
  dropTable,
  insert,
  select,
  selectOne,
  createTransaction
}