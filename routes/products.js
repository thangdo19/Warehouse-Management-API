const express = require('express')
const router = express.Router()
const _ = require('lodash')
const sequelize = require('../db/connection')
const { Product, validateProduct } = require('../models/Product')
const { Category, validateCategory } = require('../models/Category')
const { Warehouse } = require('../models/Warehouse')
const { WarehouseProduct } = require('../models/WarehouseProduct')

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

/**
 * @Usage This route is used for 2 purposes: 
 *        Create new product then import it into the specified warehouse. 
 *        Handle import/export product of users.
 */
router.post('/', [validateProduct], async (req, res) => {
  const { warehouseId, actionType } = req.body
  const warehouse = await Warehouse.findOne({ where: { id: warehouseId } })
  if (!warehouse) return res.json({ statusCode: 400, message: 'Invalid warehouse' })
  // update product's stock when import/export from warehouse
  const transaction = await sequelize.transaction()
  try {
    // check if warehouse have this product or not
    let product = await Product.findOne({ where: { name: req.body.name }})
    if (!product) {
      // if user want to export a product not exist, response
      if (actionType === 'EXPORT') return res.json({ statusCode: 400, message: 'Product not found. Cannot export'})
      // create product & add relationship to warehouse
      product = await Product.create(req.body, { transaction: transaction })
      const warehProd = await warehouse.addProduct(product.id, { 
        transaction: transaction,
        through: { stock: req.body.stock } 
      })
      await transaction.commit()
      return res.json({ statusCode: 201, data: warehProd })
      // console.log('Get products of warehouse:', await warehouse.getProducts())
    }
    // find relationship between warehouse & product
    let warehProd = await WarehouseProduct.findOne({
      where: {
        warehouseId: warehouse.id,
        productId: product.id
      }
    })
    // if warehouse not connected with product, add relationship here
    /** This is used when the system already have the product, but the current warehouse
    doesn't have this product */
    if (!warehProd) {
      warehProd = (await warehouse.addProduct(product.id, { transaction: transaction }))[0]
      console.log('After:', warehProd)
    }
    // update stock
    if (actionType === 'IMPORT') {
      warehProd = await warehProd.update({ stock: warehProd.stock + req.body.stock }, {
        transaction: transaction
      })
    }
    else if (actionType == 'EXPORT') {
      if (warehProd.stock < req.body.stock) return res.json({ statusCode: 400, message: 'Not enough stock to export'})
      warehProd = await warehProd.update({ stock: warehProd.stock - req.body.stock }, {
        transaction: transaction
      })
    }
    // done, commit transaction & response
    await transaction.commit()
    return res.json({ statusCode: 200, data: warehProd })
  } 
  catch (error) {
    await transaction.rollback()
    console.log(error)
    return res.json({
      statusCode: 400,
      message: error.message
    })
  }
})

router.post('/categories', [validateCategory], async (req, res) => {
  try {
    const category = await Category.create(req.body)
    return res.json({ statusCode: 201, data: category })
  } catch (error) {
    return res.json({ statusCode: 400, message: error.message })
  }
})

module.exports = router