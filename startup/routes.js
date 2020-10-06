const express = require('express')
const morgan = require('morgan')
const auth = require('../routes/auth')
const users = require('../routes/users')
const permissions = require('../routes/permissions')
const history = require('../routes/history')
const warehouses = require('../routes/warehouses')
const products = require('../routes/products')
const error = require('../middlewares/error-handler-middleware')

const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('../swagger.json');
/**
 * @Usage Add middlewares and route handlers
 * @param {*} app Application reference
 */
module.exports = function(app) {
  
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use(express.json())
  app.use(morgan('dev'))
  // auth
  app.use('/auth', auth)
  // route handlers
  app.use('/users', users)
  app.use('/permissions', permissions)
  app.use('/history', history)
  app.use('/warehouses', warehouses)
  app.use('/products', products)
  // error catcher middleware
  app.use(error)
}
