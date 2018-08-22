const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')

const { createTable, insert } = require('../src/db-utils')
const { fetchAllItems, fetchItemNames, getPrice } = require('../src/item-service')

describe('Item Service', () => {
  beforeEach(() => {
    process.env.TESTING = false
  })

  before(async () => {
    // here we're doing some table setup stuff so that we can perform assertions later
    await createTable('items')
    await insert('items', 'steering wheel', 62.59)
    await insert('items', 'windshield wiper', 23.39)
  })

  describe('fetchAllItems', () => {
    it('should fetch all items from items table', async () => {
      const items = await fetchAllItems()
      expect(items.rows).to.deep.equal([
        {id: 1, name: 'steering wheel', price: '62.59'},
        {id: 2, name: 'windshield wiper', price: '23.39'}
      ])
    })
  })

  describe('fetchItemNames', () => {
    it('should return item names in upper case from items table', async () => {
      const items = await fetchItemNames()
      expect(items).to.deep.equal([
        'STEERING WHEEL',
        'WINDSHIELD WIPER'
      ])
    })
  })

  describe('getPrice', () => {
    it('should return price for one item', async () => {
      const price = await getPrice('windshield wiper')
      expect(price).to.equal('23.39')
    })

    it('should catch error if item does not exist', async () => {
      let res
      try {
        res = await getPrice('oil')
      } catch(err) {
        console.log('err', err)
        res = err
      }
      expect(res.message).to.equal('Either no items, or item name was wrong/does not exist')
    })
  })

  describe.only('error handling', () => {
    it('should catch error if database is down', async () => {
      process.env.TESTING = 'true'

      let res
      try {
        res = await getPrice()
      } catch(err) {
        console.log('err', err)
        res = err
      }
      expect(res.message).to.equal('Either no items, or item name was wrong/does not exist')
    })
  })
})