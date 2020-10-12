const express = require('express')
const router = express.Router()
const { Warehouse, validateWarehouse } = require('../models/Warehouse')
const { City, validateCity } = require('../models/City')
const { auth } = require('../middlewares/auth')

router.get('/', async (req, res) => {
  const warehouses = await Warehouse.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  })
  return res.json({ statusCode: 200, data: warehouses })
})

router.get('/cities', async (req, res) => {
  const cities = await City.findAll({ 
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: {
      model: Warehouse,
      as: 'warehouses',
      attributes: ['id', 'name', 'address', 'description']
    }
  })
  return res.json({ statusCode: 200, data: cities })
})

router.post('/', [auth, validateWarehouse], async (req, res) => {
  const warehouse = await Warehouse.create(req.body)
  return res.json({ statusCode: 200, data: warehouse })
})

router.post('/cities', [auth, validateCity], async (req, res) => {
  const city = await City.create(req.body)
  return res.json({ statusCode: 200, data: city })
})

module.exports = router