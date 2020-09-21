const express = require('express')
const router = express.Router()
const sequelize = require('../db/connection')
const { User, validateUser } = require('../models/User')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  })
  return res.json({
    statusCode: 200,
    data: users
  })
})

router.post('/', [validateUser], async (req, res) => {
  const user = await User.create(req.body)
  return res.json({
    statusCode: 201,
    data: user
  })
})

module.exports = router
