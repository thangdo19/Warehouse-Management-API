/**
 * @Usage This function is used to config env variables,
 * shutdown server if JWT_KEY not provided
 */
module.exports = function() {
  require('dotenv').config()
  if (!process.env.JWT_KEY) {
    console.log('FATAL ERROR: JWT_KEY not provided')
    process.exit(1)
  }
}
