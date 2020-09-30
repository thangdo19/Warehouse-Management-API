const express = require('express')
const router = express.Router()
const _ = require('lodash')
const sequelize = require('../db/connection')
const { Product, validateProduct } = require('../models/Product')
const { Category, validateCategory } = require('../models/Category')
const { Warehouse } = require('../models/Warehouse')

router.get('/', async (req, res) => {
  const products = await Product.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: {
      model: Warehouse,
      as: 'warehouses'
    }
  })
  return res.json({ statusCode: 200, data: products })
})

router.get('/categories', async (req, res) => {
  const categories = await Category.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: {
      model: Product,
      as: 'products',
      attributes: { exclude: ['categoryId', 'createdAt', 'updatedAt'] }
    }
  })
  return res.json({ statusCode: 200, data: categories })
})

router.post('/', [validateProduct], async (req, res) => {
  const { warehouseId } = req.body
  const transaction = await sequelize.transaction()
  
  try {
    const product = await Product.create(_.omit(req.body, ['warehouseId']), {
      transaction: transaction
    })

    await product.addWarehouse(warehouseId, {
      transaction: transaction
    })
    
    await transaction.commit()
    return res.json({ statusCode: 200, data: product })
  } catch (error) {
    await transaction.rollback()
    return res.json({ statusCode: 400, message: error.message })
  }
})

router.post('/categories', [validateCategory], async (req, res) => {
  try {
    const category = await Category.create(req.body)
    return res.json({ statusCode: 200, data: category })
  } catch (error) {
    return res.json({ statusCode: 400, message: error.message })
  }
})

module.exports = router