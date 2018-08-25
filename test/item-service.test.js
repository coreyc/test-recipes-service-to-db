const chai = require('chai')
const chaiAsPromised = require('chai-as-promised');

const expect = chai.expect
chai.use(chaiAsPromised)

const { createTable, insert, dropTable } = require('../src/db-utils')
const { fetchAllItems, fetchItemNames, getPrice } = require('../src/item-service')

describe('Item Service', () => {
  before(async () => {
    // here we're doing some table setup stuff so that we can perform assertions later
    // this is basically like running a fixture
    await createTable('items')
    await insert('items', 'steering wheel', 62.59)
    await insert('items', 'windshield wiper', 23.39)
  })

  afterEach(() => {
    process.env.UNHAPPY = false
  })

  after(async () => {
    await dropTable()
  })

  describe('fetchAllItems', () => {
    it('should fetch all items from items table', async () => {
      const items = await fetchAllItems()
      expect(items.rows).to.deep.equal([
        {id: 1, name: 'steering wheel', price: '62.59'},
        {id: 2, name: 'windshield wiper', price: '23.39'}
      ])
    })

    it('should catch error if database is down', () => {
      process.env.UNHAPPY = 'true'
      expect(fetchAllItems()).to.be.rejected
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

    it('should catch error if database is down', () => {
      process.env.UNHAPPY = 'true'
      expect(fetchItemNames()).to.be.rejected
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
        res = err
      }
      expect(res.message).to.equal('Either no items, or item name was wrong/does not exist')
    })

    it('should catch error if database is down', async () => {
      process.env.UNHAPPY = 'true'
      console.log('process.env.UNHAPPY', process.env.UNHAPPY)
      // getprice returns promise, so await getPrice does not return promise and this wont work
      // expect(await getPrice()).to.be.rejected
      await expect(getPrice()).to.be.rejectedWith('connect ECONNREFUSED 127.0.0.1:3211')
    })
  })
})