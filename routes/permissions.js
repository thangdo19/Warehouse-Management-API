const { Permission, validatePermission } = require('../models/Permission')
const { PermissionDetail , validateActions, addDetails } = require('../models/PermissionDetail')
const { auth } = require('../middlewares/auth')
const express = require('express')
const router = express.Router()
const sequelize = require('../db/connection')
const pagination = require('../functions/pagination')

router.get('/',  [auth],async (req, res) => {
  const itemCount = await Permission.count()
  const options = pagination(req.query, itemCount)
  const permissions = await Permission.findAll({ ...options })

  return res.status(200).json({
    statusCode: 200,
    data: {
      permissions,
      ...options
    }
  })
})//oke swagger

router.get('/:id/details',  [auth],async (req, res) => {
  const permission = await Permission.findOne({ where: { id: req.params.id } })
  if (!permission) return res.status(404).json({ statusCode: 404, message: 'Permission not found' })

  return res.status(200).json({
    statusCode: 200,
    data: await permission.getPermissionDetails({
      attributes: ['actionCode', 'actionName', 'checkAction']
    })
  })
})//chua xog

router.post('/', [auth, validatePermission], async (req, res) => {
  const transaction = await sequelize.transaction()
  
  try {
    const permission = await Permission.create(req.body, { transaction: transaction })
    // Add permission details (includes all permission that available in the system)
    await addDetails(permission.id, transaction)

    await transaction.commit()
    return res.status(201).json({
      statusCode: 201,
      data: permission
    })
  } 
  catch (error) {
    await transaction.rollback()
    return res.status(400).json({
      statusCode: 400,
      message: error.message
    })
  }
})//oke swagger

// update checkAction for permission detail
router.patch('/:id/details', [auth, validateActions], async (req, res) => {
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
    return res.status(200).json({
      statusCode: 200
    })
  } 
  catch (error) {
    console.log(error)

    await transaction.rollback()
    return res.status(400).json({
      statusCode: 400,
      message: error.message
    })
  }
})

module.exports = router
