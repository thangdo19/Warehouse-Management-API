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
swaggerDocumentUser = require('../swagger/swagger-user.json');
swaggerDocumentProduct = require('../swagger/swagger-product.json');
/**
 * @Usage Add middlewares and route handlers
 * @param {*} app Application reference
 */
module.exports = function(app) {
  
  app.use('/api-docs-user', swaggerUi.serve, swaggerUi.setup(swaggerDocumentUser));//swagger for user
  app.use('/api-docs-product', swaggerUi.serve, swaggerUi.setup(swaggerDocumentProduct));//swagger for product
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
