const sequelize = require('../db/connection')
const { DataTypes } = require('sequelize')
const Joi = require('joi')

const History = sequelize.define('History', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  typeId: {
    type: DataTypes.INTEGER
  },
  warehouseId: {
    type: DataTypes.INTEGER
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date()
  },
  note: {
    type: DataTypes.STRING(255),
  },
}, {
  tableName: 'histories'
})

/**
 * @Usage Validate history as a middleware
 */
function validateHistory(req, res, next) {
  const schema = Joi.object({
    typeId: Joi.number(),
    warehouseId: Joi.number(),
    date: Joi.date().optional(),
    note: Joi.string().max(255).optional()
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
  History,
  validateHistory
}
