let path = require('path')
let Sequelize = require('sequelize')

let sequelize = new Sequelize('', '', '', {
  dialect: 'sqlite',
  operatorsAliases: false,
  storage: path.join(__dirname, '../db/inventory.db')
})

const User = require('./user')(sequelize)
const Product = require('./product')(sequelize)
const Mutation = require('./mutation')(sequelize)

Mutation.belongsTo(Product, {foreignKey: 'productID', targetKey: 'id'})
Product.hasMany(Mutation, {foreignKey: 'productID', sourceKey: 'id'})

sequelize.sync({
  logging: console.log,
  // force: true,
}).then(() => {
  console.log('synced')
})

module.exports = {
  User,
  Product,
  Mutation
}
