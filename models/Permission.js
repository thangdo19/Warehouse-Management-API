const Joi = require('joi')
const sequelize = require('../db/connection')
const { DataTypes } = require('sequelize')

const Permission = sequelize.define('Permission', {
  id: {
    type: DataTypes.INTEGER(),
    primaryKey: true,
    autoIncrement: true
  },
  permissionName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
}, {
  tableName: 'permissions'
})

/**
 * @Usage Validate permission as a middleware
 */
function validatePermission(req, res, next) {
  const schema = Joi.object({
    permissionName: Joi.string().max(255)
  })
  // seek for error
  const { error } = schema.validate(req.body, {
    presence: (req.method !== 'PATCH') ? 'required' : 'optional',
    abortEarly: false
  })
  // response when having error
  if (error) return res.status(400).json({ 
    statusCode: 400,
    message: error.message
  })
  else next() // no errors
}

module.exports = {
  Permission,
  validatePermission
}
