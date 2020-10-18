const Joi = require('joi')
const { DataTypes } = require('sequelize')
const sequelize = require('../db/connection')

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER(),
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(),
    allowNull: false,
    unique: true,
    validate: {
      is: /^[0-9]*$/
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      is: /\S+@\S+\.\S+/
    }
  },
  password: {
    type: DataTypes.STRING(1024),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(255)
  }
})

/**
 * @Usage Validate user as a middleware
 */
function validateUser(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().max(255),
    phone: Joi.string().min(10).max(11),
    email: Joi.string().email().max(255),
    password: Joi.string().max(50),
    address: Joi.string().max(255).optional()
  })
  // seek for error
  const { error } = schema.validate(req.body, {
    presence: (req.method !== 'PATCH') ? 'required': 'optional',
    abortEarly: false
  })
  // response when having error
  if (error) return res.status(400).json({ statusCode: 400, message: error.message })
  else next() // no errors
}

/**
 * @Usage Validate user permissions as a middleware
 */
function validateUserPermission(req, res, next) {
  const schema = Joi.object({
    userId: Joi.number(),
    permissionIds: Joi.array().items(Joi.number())
  })
  // seek for error
  const { error } = schema.validate(req.body, {
    presence: (req.method !== 'PATCH') ? 'required': 'optional',
    abortEarly: false
  })
  // response when having error
  if (error) return res.status(400).json({ statusCode: 400, message: error.message })
  else next() // no errors
}

module.exports = {
  User,
  validateUser,
  validateUserPermission
}
