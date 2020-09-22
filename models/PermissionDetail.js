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
  if (error) return res.json({ 
    statusCode: 400, 
    message: error.message 
  })
  else next() // no errors
}

async function addDetails(perId, transaction) {
  const actionNames = [
    'CREATE_USER', 'VIEW_USER', 'EDIT_USER', 'DELETE_USER',
    'CREATE_PERMISSION', 'VIEW_PERMISSION', 'EDIT_PERMISSION', 'DELETE_PERMISSION',
  ]
  for (const action of actionNames) {
    await PermissionDetail.create(await createDetail(perId, action), { transaction: transaction })
  }
}

async function createDetail(permissionId, actionName) {
  const detail = {
    permissionId: permissionId,
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
  createDetail,
  addDetails
}
