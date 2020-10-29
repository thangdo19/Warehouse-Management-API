const { pickBy, identity } = require('lodash')

module.exports = function(query, itemCount) {
  let options = {}

  if (!query.limit || !query.page) {
    if (!query.limit) options.limit = 10
    if (!query.page) { 
      options.offset = 0,
      query.page = 1
    }
  }
  else {
    options.limit = parseInt(query.limit, 10)
    options.offset = (parseInt(query.page, 10) - 1) * parseInt(query.limit, 10)
  }
  console.log(itemCount)
  options.currentPage = parseInt(query.page, 10)
  options.pageCount = Math.ceil(itemCount/options.limit)

  options = pickBy(options, identity) // remove properties which have falsy value
  return options
}
