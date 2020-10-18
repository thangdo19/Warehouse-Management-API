const { User } = require('../models/User')
const jwt = require('jsonwebtoken')

/**
 * @Usage Authenticate via jwt Bearer token with Authorization header
 */
async function auth(req, res, next) {
  if (req.header('Authorization') && req.header('Authorization').startsWith("Bearer ")) {
    // take string 'Bearer ' out from Authorization to take pure token
    const token = req.header('Authorization').substring(7, req.header('Authorization').length)
    
    try {
      const payload = jwt.verify(token, process.env.JWT_KEY||12312)
      req.user = payload
      next()
    } 
    catch (error) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Access denied. Invalid token'
      })
    }
  } 
  else {
    return res.status(401).json({
      statusCode: 401,
      message: 'Access denied. No token provided or invalid form of token'
    })
  }
}

module.exports = {
  auth
}
