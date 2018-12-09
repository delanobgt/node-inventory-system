let Sequelize = require('sequelize')

let model = function (sequelize) {
  return sequelize.define('user', {
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    }
  })
}

module.exports = model
