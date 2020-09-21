/**
 * @Usage This function is a middleware that 
 * handle uncaught exception thrown in route handler
 */
module.exports = function(err, req, res, next) {
  console.log('Error:', err)
  return res.json({
    statusCode: 500,
    message: 'Internal server error'
  })
}
