const Joi = require('joi')
const sequelize = require('../db/connection')
const { DataTypes } = require('sequelize')

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.STRING(255),
  },
}, {
  tableName: 'categories'
})

/**
 * @Usage Validate category as a middleware
 */
function validateCategory(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().max(255),
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
  Category,
  validateCategory
}