const { User, validateUser, validateUserPermission } = require('../models/User')
const { UserPermission } = require('../models/UserPermission')
const { Permission } = require('../models/Permission')
const express = require('express')
const router = express.Router()
const sequelize = require('../db/connection')
const bcrypt = require('bcrypt')
const { auth } = require('../middlewares/auth')
const { checkAction } = require('../middlewares/check-action')
const pagination = require('../functions/pagination')
const { UserWarehouse, validateUserWarehouse } = require('../models/UserWarehouse')
const { Warehouse } = require('../models/Warehouse')
const { omit, pick } = require('lodash')

router.get('/', [auth], async (req, res) => {
  const itemCount = await User.count()
  const options = pagination(req.query, itemCount)
  const users = await User.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
    ...options
  })
  return res.status(200).json({
    statusCode: 200,
    data: {
      users,
      ...options
    }
  })
})//oke swagger

router.get('/test', [auth, checkAction(['CREATE_USER', 'EDIT_USER'])], async (req, res) => {
  return res.status(200).json({ yia: 'pass'})
})

// Get all users with their permissions
router.get('/permissions', [auth], async (req, res) => {
  const itemCount = await User.count()
  const options = pagination(req.query, itemCount)
  const users = await User.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
    include: {
      model: Permission,
      as: 'permissions',
      attributes: ['id', 'permissionName'],
      through: { attributes: [] }
    },
    ...options
  })
  return res.status(200).send({
    statusCode: 200,
    data: {
      users,
      ...options
    }
  })
})

router.get('/:id', [auth], async (req, res) => {
  const user = await User.findOne({ where: { id: req.params.id }})
  if (!user) return res.status(400).json({
    statusCode: 404,
    message: `User with id "${req.params.id}" not found`
  })

  return res.status(200).json({
    statusCode: 200,
    data: user
  })
})//oke swagger

router.post('/', [auth,validateUser], async (req, res) => {
  // hash password
  req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt())

  try {
    const user = await User.create(req.body)
    return res.status(201).json({
      statusCode: 201,
      data: user,
    })
  } 
  catch (error) {
    return res.status(400).json({
      statusCode: 400,
      message: error.message
    })
  }
})//oke swagger

// add permission to user
router.post('/permissions', [auth, validateUserPermission], async (req, res) => {
  const user = await User.findOne({ where: { id: req.body.userId } })
  if (!user) return res.status(404).json({ statusCode: 404, message: `User with id "${req.body.userId}" not found`})

  const transaction = await sequelize.transaction()

  try {
    for (const perId of req.body.permissionIds) {
      const userPermission = await user.addPermission(perId, {
        transaction: transaction
      })
      console.log('userPermission:', userPermission)
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

router.post('/warehouse', [auth, validateUserWarehouse], async (req, res) => {
  const { userEmail, warehouseId } = req.body
  const user = await User.findOne({ where: { email: userEmail }})
  const warehouse = await Warehouse.findOne({ where: { id: warehouseId }})

  if (!user || !warehouse) return res.status(404).json({
    statusCode: 404,
    message: 'Cannot find user or warehouse'
  })

  let userWarehouse = await UserWarehouse.findOne({
    where: { userId: user.id, warehouseId: warehouse.id }
  })
  if (userWarehouse) return res.status(200).json({ statusCode: 200, data: { userWarehouse } })
  userWarehouse = await UserWarehouse.create({ userId: user.id, warehouseId: warehouse.id })
  return res.status(201).json({
    statusCode: 201,
    data: { userWarehouse }
  })
})

router.patch('/:id', [auth, validateUser], async (req, res) => {
  const editUserDto = omit(req.body, ['email', 'password'])
  console.log(editUserDto)
  try {
    const user = await User.findOne({ where: { id: req.params.id }})
    if (!user) return res.status(404).json({ message: "User not found" })

    await User.update(editUserDto, { where: { id: req.params.id }})
    return res.status(200).json()
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

router.patch('/:id/password', [auth, validateUser], async (req, res) => {
  const editUserDto = pick(req.body, ['password'])
  if (!editUserDto.password || editUserDto.password.length === 0)
    return res.status(400).json({ message: 'Password is empty'})
  editUserDto.password = await bcrypt.hash(editUserDto.password, await bcrypt.genSalt())
  try {
    const user = await User.findOne({ where: { id: req.params.id }})
    if (!user) return res.status(404).json({ message: "User not found" })

    await User.update(editUserDto, { where: { id: req.params.id }})
    return res.status(200).json()
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

router.delete('/:id', [auth], async (req, res) => {
  const deleted = await User.destroy({ where: { id: req.params.id } })

  if (deleted === 0) return res.status(404).json({ 
    statusCode: 404,
    message: `User with id "${req.params.id}" not found`
  })
  else return res.status(200).json({
    statusCode: 200
  })
})//oke swagger

module.exports = router
