const chai = require('chai')
const expect = chai.expect

const { createTable, insert, select } = require('../src/service')

describe('Item Service', () => {
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
      const res = await insert('items', 'steering wheel')
      expect(res.rowCount).to.equal(1)
    })
  })

  describe('select', () => {
    it('should select items from the table', async () => {
      const res = await select('items')
      expect(res.rows).to.deep.equal([ { id: 1, text: 'steering wheel' } ])
    })
  })
})