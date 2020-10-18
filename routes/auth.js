const { User } = require('../models/User')
const Joi = require('joi')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/', [validateAuth], async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email } })
  if (!user) return res.status(401).json({
    statusCode: 401,
    message: 'Invalid email or password'
  })

  const isValid = await bcrypt.compare(req.body.password, user.password)
  if (!isValid) return res.status(401).json({
    statusCode: 401,
    message: 'Invalid email or password'
  })

  // authenticate success
  const payload = { id: user.id }
  return res.status(200).json({ statusCode: 200, token: await jwt.sign(payload, process.env.JWT_KEY)})
})

function validateAuth(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().email().max(255),
    password: Joi.string().max(50)
  })
  // seek for error
  const { error } = schema.validate(req.body, {
    presence: 'required',
    abortEarly: false
  })
  // response when having error
  if (error) return res.json({ statusCode: 400, message: error.message })
  else next() // no errors
}

module.exports = router