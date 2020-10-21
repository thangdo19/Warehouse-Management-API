const Joi = require('joi')
const { DataTypes } = require('sequelize')
const sequelize = require('../db/connection')

const PermissionDetail = sequelize.define('PermissionDetail', {
  id: {
    type: DataTypes.INTEGER(),
    primaryKey: true,
    autoIncrement: true
  },
  permissionId: {
    type: DataTypes.INTEGER()
  },
  actionCode: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  actionName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  checkAction: {
    type: DataTypes.BOOLEAN(),
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'permission_details'
})

/**
 * @Usage Validate permission detail as a middleware
 */
function validatePermissionDetail(req, res, next) {
  const schema = Joi.object({
    permissionId: Joi.number(),
    actionCode: Joi.string().max(255),
    actionName: Joi.string().max(255),
    checkAction: Joi.boolean().optional(),
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

/**
 * @Usage Validate permission detail as a middleware for PATCH
 */
function validatePatchDetail(req, res, next) {
  const schema = Joi.object({
    actionCode: Joi.string().max(255),
    actionName: Joi.string().max(255),
    checkAction: Joi.boolean(),
  })
  // seek for error
  const { error } = schema.validate(req.body, {
    presence: 'optional',
    abortEarly: false
  })
  // response when having error
  if (error) return res.status(400).json({ 
    statusCode: 400, 
    message: error.message 
  })
  else next() // no errors
}

/**
 * @Usage This middleware is used to change check action of permission details
 */
function validateActions(req, res, next) {
  const schema = Joi.object({
    actionNames: Joi.array().items(Joi.string().max(255)),
    havePermission: Joi.boolean()
  })
  const { error } = schema.validate(req.body, {
    presence: 'required',
    abortEarly: false
  })
  if (error) return res.status(400).json({ status: 400, message: error.message });
  next()
}

/**
 * @Usage Add a set of actions into permission
 * @param {*} perId id of permission which we want to add a set of actions
 * @param {*} transaction transaction reference
 */
async function addDetails(perId, transaction) {
  const actionNames = [
    'CREATE_USER', 'VIEW_USER', 'EDIT_USER', 'DELETE_USER',
    'CREATE_PERMISSION', 'VIEW_PERMISSION', 'EDIT_PERMISSION', 'DELETE_PERMISSION',
    'CREATE_WAREHOUSE', 'VIEW_WAREHOUSE', 'EDIT_WAREHOUSE', 'DELETE_WAREHOUSE',
    'CREATE_PRODUCT', 'VIEW_PRODUCT', 'EDIT_PRODUCT', 'DELETE_PRODUCT',
  ]
  for (const action of actionNames) {
    await PermissionDetail.create(await createDetail(perId, action), { transaction: transaction })
  }
}

/**
 * @Usage Return a plain object of permission detail's properties
 * @param {*} perId Id of permission which we want to add details
 * @param {*} actionName Name of action
 */
async function createDetail(perId, actionName) {
  const detail = {
    permissionId: perId,
    actionCode: actionName.split('_')[0],
    actionName: actionName,
    checkAction: 0
  }
  // create permission detail
  return detail
}

module.exports = {
  PermissionDetail,
  validatePermissionDetail,
  validatePatchDetail,
  validateActions,
  createDetail,
  addDetails
}
