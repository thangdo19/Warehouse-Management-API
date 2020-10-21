const express = require('express')
const router = express.Router()
const _ = require('lodash')
const sequelize = require('../db/connection')
const { Product, validateProduct } = require('../models/Product')
const { Category, validateCategory } = require('../models/Category')
const { Warehouse } = require('../models/Warehouse')
const { WarehouseProduct } = require('../models/WarehouseProduct')
const { HistoryType } = require('../models/HistoryType')
const { History } = require('../models/History')
const { auth } = require('../middlewares/auth')
// const { checkAction } = require('../middlewares/check-action')
const pagination = require('../functions/pagination')

router.get('/', async (req, res) => {
  const itemCount = await Product.count()
  const options = pagination(req.query, itemCount)
  const products = await Product.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: {
      model: Warehouse,
      as: 'warehouses',
      attributes: ['id', 'cityId', 'name'],
      through: { attributes: [] }
    },
    ...options
  })
  return res.status(200).json({ 
    statusCode: 200, 
    data: {
      products,
      ...options
    }
  })
})//oke swagger

router.get('/:id', async (req, res) => {
  const product = await Product.findOne({
    where: { id: req.params.id },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: {
      model: Warehouse,
      as: 'warehouses',
      attributes: ['id', 'cityId', 'name'],
      through: { attributes: [] }
    }
  })
  if (!product) return res.status(404).json({ statusCode: 404, message: `There is no product with id "${req.params.id}"`})
  return res.status(200).json({ statusCode: 200, data: product })
})

router.get('/categories', async (req, res) => {
  const itemCount = await Category.count()
  const options = pagination(req.query, itemCount)
  const categories = await Category.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: {
      model: Product,
      as: 'products',
      attributes: { exclude: ['categoryId', 'createdAt', 'updatedAt'] }
    },
    ...options
  })
  return res.status(200).json({ 
    statusCode: 200, 
    data: {
      categories,
      ...options
    } 
  })
})//oke swagger

router.get('/categories/:id', async (req, res) => {
  const category = await Category.findOne({
    where: { id: req.params.id },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: {
      model: Product,
      as: 'products',
      attributes: { exclude: ['categoryId', 'createdAt', 'updatedAt'] }
    }
  })
  return res.status(200).json({ statusCode: 200, data: category })
})//oke swagger
// get products by their warehouse
router.get('/warehouse/:id', async (req, res) => {
  const warehouse = await Warehouse.findOne({ where: { id: req.params.id }})
  if (!warehouse) return res.status(404).json({ statusCode: 404, message: `There is no warehouse with id "${req.params.id}"`})
  const products = await warehouse.getProducts({
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  })
  return res.status(200).json({ statusCode: 200, data: products })
})

router.get('/test', [auth], async (req, res) => {
  return res.status(200).json({ data: req.user })
})

/**
 * @Usage This route is used for 2 purposes: 
 *        Create new product then import it into the specified warehouse. 
 *        Handle import/export product of users.
 */
router.post('/', [auth, validateProduct], async (req, res) => {
  const { warehouseId, actionType } = req.body
  const warehouse = await Warehouse.findOne({ where: { id: warehouseId } })
  if (!warehouse) return res.status(400).json({ statusCode: 400, message: 'Invalid warehouse' })
  // update product's stock when import/export from warehouse
  const transaction = await sequelize.transaction()
  try {
    // check if warehouse have this product or not
    let product = await Product.findOne({ where: { name: req.body.name }})
    if (!product) {
      // if user want to export a product not exist, response
      if (actionType === 'EXPORT') return res.status(400).json({ statusCode: 400, message: 'Product not found. Cannot export'})
      const warehProd = await createNewProductAndAddRelationship(req, transaction, warehouse)
      // create history, commit & response
      const history = await createWarehouseHistory(actionType, warehouse.id, `${actionType} amount ${warehProd[0].stock}`)
      await createUserHistory(req, transaction, history, req.user.id)
      await transaction.commit()
      return res.status(201).json({ statusCode: 201, data: warehProd })
    }
    // handle stock when import/export from warehouse
    const warehProd = await updateStock(req, transaction, warehouse, product, actionType)
    // done, create history, commit transaction & response
    const history = await createWarehouseHistory(actionType, warehouse.id, `${actionType} amount ${req.body.stock}`)
    await createUserHistory(req, transaction, history, req.user.id)
    await transaction.commit()
    return res.status(200).json({ statusCode: 200, data: warehProd })
  } 
  catch (error) {
    await transaction.rollback()
    console.log(error)
    return res.status(400).json({
      statusCode: 400,
      message: error.message
    })
  }
})//chua xong

router.post('/categories', [auth, validateCategory], async (req, res) => {
  try {
    const category = await Category.create(req.body)
    return res.status(201).json({ statusCode: 201, data: category })
  } catch (error) {
    return res.status(400).json({ statusCode: 400, message: error.message })
  }
})//oke swagger

async function createWarehouseHistory(actionType, warehouseId, note) {
  const type = await HistoryType.findOne({ where: { name: actionType } })
  return await History.create({
    typeId: type.id,
    warehouseId,
    note
  })
}

/**
 * @Usage This function create a new product with data from req param,
 * then create WarehouseProduct middle table between Product & Warehouse and
 * fill with stock prop
 * @param {*} req Request reference
 * @param {*} transaction Transaction reference
 * @param {*} warehouse Warehouse reference to add relation with
 */
async function createNewProductAndAddRelationship(req, transaction, warehouse) {
  try {
    // create product & add relationship to warehouse
    product = await Product.create(req.body, { transaction: transaction })
    const warehProd = await warehouse.addProduct(product.id, { 
      transaction: transaction,
      through: { stock: req.body.stock } 
    })
    return warehProd
  } 
  catch (error) {
    throw error
  }
}

/**
 * @Usage Find middle record between Warehouse & Product, if not 
 * (product is in another warehouse but not this warehouse) => create one. 
 * When it found. Update the stock when import/export from warehouse
 * @param {*} req 
 * @param {*} transaction 
 * @param {*} warehouse 
 * @param {*} product 
 * @param {*} actionType 
 */
async function updateStock(req, transaction, warehouse, product, actionType) {
  try {
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
    }
    // update stock
    if (actionType === 'IMPORT') {
      warehProd = await warehProd.update({ stock: warehProd.stock + req.body.stock }, {
        transaction: transaction
      })
    }
    else if (actionType == 'EXPORT') {
      if (warehProd.stock < req.body.stock) return res.status(400).json({ statusCode: 400, message: 'Not enough stock to export'})
      warehProd = await warehProd.update({ stock: warehProd.stock - req.body.stock }, {
        transaction: transaction
      })
    }

    return warehProd
  } 
  catch (error) {
    throw error
  }
}

async function createUserHistory(req, transaction, history, userId) {
  try {
    const userHistory = await history.addUser(userId, { transaction: transaction })
    console.log(userHistory)
  } catch (error) {
    throw error
  }
}

module.exports = router