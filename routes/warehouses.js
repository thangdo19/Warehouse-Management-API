const express = require('express')
const router = express.Router()
const { Warehouse, validateWarehouse } = require('../models/Warehouse')
const { City, validateCity } = require('../models/City')

router.get('/', async (req, res) => {
  const warehouses = await Warehouse.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  })
  return res.json({ statusCode: 200, data: warehouses })
})//oke swagger // tra them ve city name

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
})//oke swagger

router.post('/', [validateWarehouse], async (req, res) => {
  const warehouse = await Warehouse.create(req.body)
  return res.json({ statusCode: 200, data: warehouse })
})//oke swagger

router.post('/cities', [validateCity], async (req, res) => {
  const city = await City.create(req.body)
  return res.json({ statusCode: 200, data: city })
})//oke swagger

module.exports = router