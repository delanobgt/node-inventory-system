let Sequelize = require('sequelize')

let model = function (sequelize) {
  return sequelize.define('product', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
  })
}

module.exports = model