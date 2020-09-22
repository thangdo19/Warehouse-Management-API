const { Permission, validatePermission } = require('../models/Permission')
const { PermissionDetail ,validatePermissionDetail, addDetails, createDetail } = require('../models/PermissionDetail')
const express = require('express')
const router = express.Router()
const sequelize = require('../db/connection')

router.get('/', async (req, res) => {
  const permissions = await Permission.findAll()

  return res.json({
    statusCode: 200,
    data: permissions
  })
})

router.post('/', [validatePermission], async (req, res) => {
  const transaction = await sequelize.transaction()

  try {
    const permission = await Permission.create(req.body, { transaction: transaction })
    await addDetails(permission.id, transaction)

    await transaction.commit()
    return res.json({
      statusCode: 201,
      data: permission
    })
  } 
  catch (error) {
    await transaction.rollback()
    return res.json({
      statusCode: 400,
      message: error.message
    })
  }
})

router.get('/:id/details', async (req, res) => {
  const permission = await Permission.findOne({ id: req.params.id })
  if (!permission) return res.json({ statusCode: 404, message: 'Permission not found' })

  return res.json({
    statusCode: 200,
    data: await permission.getPermissionDetails({
      attributes: ['actionCode', 'actionName']
    })
  })
})

module.exports = router
