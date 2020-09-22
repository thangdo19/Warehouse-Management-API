const { User, validateUser } = require('../models/User')
const express = require('express')
const router = express.Router()
const sequelize = require('../db/connection')
const bcrypt = require('bcrypt')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt', 'password'] }
  })
  return res.json({
    statusCode: 200,
    data: users
  })
})

router.post('/', [validateUser], async (req, res) => {
  // hash password
  req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt())

  try {
    const user = await User.create(req.body)
    return res.json({
      statusCode: 201,
      data: user
    })
  } 
  catch (error) {
    return res.json({
      statusCode: 400,
      message: error.message
    })
  }
})

router.delete('/:id', async (req, res) => {
  const deleted = await User.destroy({ where: { id: req.params.id } })

  if (deleted === 0) return res.json({ 
    statusCode: 404,
    message: `User with id "${req.params.id}" not found`
  })
  else return res.json({
    statusCode: 200
  })
})

router.patch('/:id', [validateUser], async (req, res) => {
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
