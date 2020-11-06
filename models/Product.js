const sequelize = require('../db/connection')
const { DataTypes } = require('sequelize')
const Joi = require('joi')

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  categoryId: {
    type: DataTypes.INTEGER
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  }, 
  note: {
    type: DataTypes.STRING(255),
  },
}, {
  tableName: 'products'
})

/**
 * @Usage Validate product as a middleware
 */
function validateProduct(req, res, next) {
  const schema = Joi.object({
    categoryId: Joi.number(),
    warehouseId: Joi.number(),
    name: Joi.string().max(255),
    note: Joi.string().max(255).optional(),
    stock: Joi.number(),
    actionType: Joi.string().valid('IMPORT', 'EXPORT')
  })
  // seek for error
  const { error } = schema.validate(req.body, {
    presence: (req.method !== 'PATCH') ? 'required' : 'optional',
    abortEarly: false
  })
  // response when having error
  if (error) return res.status(400).json({ statusCode: 400, message: error.message })
  else next() // no error
}

function validateManagingProduct(req, res, next) {
  const schema = Joi.object({
    products: Joi.array().items(
      Joi.object({
        categoryId: Joi.number().optional(),
        warehouseId: Joi.number(),
        name: Joi.string().max(255),
        note: Joi.string().max(255).optional(),
        stock: Joi.number(),
        actionType: Joi.string().valid('IMPORT', 'EXPORT')
      })
    )
  })
  // seek for error
  const { error } = schema.validate(req.body, {
    presence: (req.method !== 'PATCH') ? 'required' : 'optional',
    abortEarly: false
  })
  // response when having error
  if (error) return res.status(400).json({ statusCode: 400, message: error.message })
  else next() // no error
}

module.exports = {
  Product,
  validateProduct,
  validateManagingProduct
}
