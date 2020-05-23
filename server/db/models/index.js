const User = require('./user')
const Transaction = require('./transactions')

Transaction.belongsTo(User)
User.hasMany(Transaction)

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 **/

module.exports = {
  User,
  Transaction
}
