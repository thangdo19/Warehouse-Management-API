const express = require('express')
const router = express.Router()
const { Warehouse, validateWarehouse } = require('../models/Warehouse')
const { City, validateCity } = require('../models/City')
const { auth } = require('../middlewares/auth')
const pagination = require('../functions/pagination')
const { User } = require('../models/User')

router.get('/',  [auth],async (req, res) => {
  const itemCount = await Warehouse.count()
  const options = pagination(req.query, itemCount)
  const warehouses = await Warehouse.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    ...options,
    include: {
      model: City,
      as: 'city',
      attributes: ['name']
    }
  })
  return res.status(200).json({ 
    statusCode: 200,
    data: {
      warehouses,
      ...options
    } 
  })
})//oke swagger // tra them ve city name

router.get('/cities',  [auth],async (req, res) => {
  const itemCount = await City.count()
  const options = pagination(req.query, itemCount)
  const cities = await City.findAll({ 
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: {
      model: Warehouse,
      as: 'warehouses',
      attributes: ['id', 'name', 'address', 'description']
    },
    ...options
  })
  return res.status(200).json({ 
    statusCode: 200, 
    data: {
      cities,
      ...options
    } 
  })
})//oke swagger

// get warehouse by userId
router.get('/user', [auth], async (req, res) => {
  const itemCount = await Warehouse.count({
    include: {
      model: User,
      as: 'users',
      where: { id: req.user.id }
    }
  })
  const options = pagination(req.query, itemCount)
  const warehouses = await Warehouse.findAll({
    include: {
      model: User,
      as: 'users',
      where: { id: req.user.id },
      attributes: []
    },
    ...options
  })
  return res.status(200).json({ 
    statusCode: 200,
    data: {
      warehouses,
      ...options
    } 
  })
})

router.get('/:id',  [auth],async (req, res) => {
  const warehouse = await Warehouse.findOne({ 
    where: { id: req.params.id },
    include: {
      model: City,
      as: 'city',
      attributes: ['name']
    }
  })
  if (!warehouse) return res.status(404).json({ statusCode: 404, message: `There is no warehouse with id "${req.params.id}"`})

  return res.status(200).json({ statusCode: 200, data: warehouse })
})//oke swagger

router.get('/:id/users', [auth], async (req, res) => {
  const warehouse = await Warehouse.findOne({ 
    where: { id: req.params.id },
    include: {
      model: User,
      as: 'users',
      attributes: { exclude: ['password'] },
      through: { attributes: [] }
    }
  })
  if (!warehouse) return res.status(404).json({ statusCode: 404, message: `There is no warehouse with id "${req.params.id}"`})

  return res.status(200).json({ statusCode: 200, data: warehouse })
})

router.get('/cities/:id',  [auth],async (req, res) => {
  const city = await City.findOne({ 
    where: { id: req.params.id },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: {
      model: Warehouse,
      as: 'warehouses',
      attributes: ['id', 'name', 'address', 'description']
    }
  })
  return res.status(200).json({ statusCode: 200, data: city })
})//oke swagger

router.post('/', [auth, validateWarehouse], async (req, res) => {
  const warehouse = await Warehouse.create(req.body)
  return res.status(200).json({ statusCode: 200, data: warehouse })
})//oke swagger

router.post('/cities', [auth, validateCity], async (req, res) => {
  const city = await City.create(req.body)
  return res.status(200).json({ statusCode: 200, data: city })
})//oke swagger

module.exports = router