const Joi = require('joi')
const sequelize = require('../db/connection')
const { DataTypes } = require('sequelize')

const City = sequelize.define('City', {
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
  tableName: 'cities'
})

/**
 * @Usage Validate city as a middleware
 */
function validateCity(req, res, next) {
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
  else next() // no errors
}

module.exports = {
  City,
  validateCity
}