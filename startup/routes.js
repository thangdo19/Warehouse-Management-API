const express = require('express')
const morgan = require('morgan')
const users = require('../routes/users')
const permissions = require('../routes/permissions')
const error = require('../middlewares/error-handler-middleware')
/**
 * @Usage Add middlewares and route handlers
 * @param {*} app Application reference
 */
module.exports = function(app) {
  app.use(express.json())
  app.use(morgan('dev'))
  // route handlers
  app.use('/users', users)
  app.use('/permissions', permissions)
  // error catcher middleware
  app.use(error)
}
