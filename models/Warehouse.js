const Joi = require('joi')
const sequelize = require('../db/connection')
const { DataTypes } = require('sequelize')

const Warehouse = sequelize.define('Warehouse', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cityId: {
    type: DataTypes.INTEGER
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(255),
  },
}, {
  tableName: 'warehouses'
})

/**
 * @Usage Validate warehouse as a middleware
 */
function validateWarehouse(req, res, next) {
  const schema = Joi.object({
    cityId: Joi.number(),
    name: Joi.string().max(255),
    address: Joi.string().max(255),
    description: Joi.string().max(255).optional()
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
  Warehouse,
  validateWarehouse
}