const { Permission, validatePermission } = require('../models/Permission')
const { PermissionDetail , validateActions, addDetails } = require('../models/PermissionDetail')
const express = require('express')
const router = express.Router()
const sequelize = require('../db/connection')

router.get('/', async (req, res) => {
  const permissions = await Permission.findAll()

  return res.json({
    statusCode: 200,
    data: permissions
  })
})//oke swagger

router.get('/:id/details', async (req, res) => {
  const permission = await Permission.findOne({ id: req.params.id })
  if (!permission) return res.json({ statusCode: 404, message: 'Permission not found' })

  return res.json({
    statusCode: 200,
    data: await permission.getPermissionDetails({
      attributes: ['actionCode', 'actionName']
    })
  })
})//chua xog

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
})//oke swagger

// update checkAction for permission detail
router.patch('/:id/details', [validateActions], async (req, res) => {
  const transaction = await sequelize.transaction()

  try {
    // update every single detail, THIS IS NOT A GOOD APPROACH
    // action not found: STILL QUERY => NEED TO FIX THIS
    for (const name of req.body.actionNames) {
      await PermissionDetail.update({
        checkAction: (req.body.havePermission) ? true : false
      }, {
        transaction: transaction,
        where: {
          permissionId: req.params.id,
          actionName: name
        }
      })
    }

    await transaction.commit()
    return res.json({
      statusCode: 200
    })
  } 
  catch (error) {
    console.log(error)

    await transaction.rollback()
    return res.json({
      statusCode: 400,
      message: error.message
    })
  }
})

module.exports = router
