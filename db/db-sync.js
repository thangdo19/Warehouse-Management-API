const sequelize = require('./connection')

/**
 * @Usage Synchronize current models with relationship to db
 */
module.exports = function() {
  sequelize.sync({ force: true })
    .then(() => console.log('Sync db successfully'))
    .catch(err => console.log(err))
}
