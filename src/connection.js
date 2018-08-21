const knex = require('knex')

const connection = knex({
  client: 'pg',
  connection: 'postgres://@localhost:5432/autoparts'
})

module.exports = connection