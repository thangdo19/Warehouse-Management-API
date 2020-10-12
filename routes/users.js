const { User, validateUser, validateUserPermission } = require('../models/User')
const { UserPermission } = require('../models/UserPermission')
const { Permission } = require('../models/Permission')
const express = require('express')
const router = express.Router()
const sequelize = require('../db/connection')
const bcrypt = require('bcrypt')
const { auth } = require('../middlewares/auth')
const { checkAction } = require('../middlewares/check-action')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt', 'password'] }
  })
  return res.json({
    statusCode: 200,
    data: users
  })
})

router.get('/test', [auth, checkAction(['CREATE_USER', 'EDIT_USER'])], async (req, res) => {
  return res.json({ yia: 'pass'})
})

router.get('/:id', [auth], async (req, res) => {
  const user = await User.findOne({ where: { id: req.params.id }})
  if (!user) return res.json({
    statusCode: 404,
    message: `User with id "${req.params.id}" not found`
  })

  return res.json({
    statusCode: 200,
    data: user
  })
})

// Get all users with their permissions
router.get('/permissions', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
    include: {
      model: Permission,
      as: 'permissions',
      attributes: ['id', 'permissionName'],
      through: { attributes: [] }
    }
  })
  return res.json({
    statusCode: 200,
    data: users
  })
})

router.post('/', [auth, validateUser], async (req, res) => {
  // hash password
  req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt())

  try {
    const user = await User.create(req.body)
    return res.json({
      statusCode: 201,
      data: user,
    })
  } 
  catch (error) {
    return res.json({
      statusCode: 400,
      message: error.message
    })
  }
})

router.post('/permissions', [auth, validateUserPermission], async (req, res) => {
  const user = await User.findOne({ where: { id: req.body.userId } })
  if (!user) return res.json({ statusCode: 404, message: `User with id "${req.body.userId}" not found`})

  const transaction = await sequelize.transaction()

  try {
    for (const perId of req.body.permissionIds) {
      const userPermission = await user.addPermission(perId, {
        transaction: transaction
      })
      console.log('userPermission:', userPermission)
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

router.delete('/:id', [auth], async (req, res) => {
  const deleted = await User.destroy({ where: { id: req.params.id } })

  if (deleted === 0) return res.json({ 
    statusCode: 404,
    message: `User with id "${req.params.id}" not found`
  })
  else return res.json({
    statusCode: 200
  })
})

router.patch('/:id', [auth, validateUser], async (req, res) => {
  const affected = (await User.update(req.body, { 
    where: { id: req.params.id }
  }))[0] // take the first element which is number of affected rows
  
  if (affected === 0) return res.json({ 
    statusCode: 404,
    message: `User with id "${req.params.id}" not found`
  })
  else return res.json({
    statusCode: 200
  })
})

module.exports = router
