const chai = require('chai')
const expect = chai.expect

const { createTable, dropTable, insert, select } = require('../src/db-utils')

describe('Database Utils', () => {
  after(async () => {
    await dropTable('items')
  })

  describe('createTable', () => {
    it('should create the table in the database', async () => {
      const res = await createTable('items')
      // because we just created the table, no rows should exist
      // the first res is actually the result from the DROP TABLE, so we take the second
      expect(res[1].rowCount).to.be.null
    })
  })

  describe('insert', () => {
    it('should insert an item into the table', async () => {
      const res = await insert('items', 'steering wheel', 62.59)
      expect(res.rowCount).to.equal(1)
    })
  })

  describe('select', () => {
    it('should select items from the table', async () => {
      const res = await select('items')
      expect(res.rows).to.deep.equal([ { id: 1, name: 'steering wheel', price: '62.59' } ])
    })
  })
})