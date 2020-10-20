const { pickBy, identity } = require('lodash')

module.exports = function(query) {
  let options = {}

  options.limit = parseInt(query.limit, 10)
  options.offset = (parseInt(query.page, 10) - 1) * parseInt(query.limit, 10)

  options = pickBy(options, identity)
  return options
}
