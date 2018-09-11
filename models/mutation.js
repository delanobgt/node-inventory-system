let Sequelize = require('sequelize')

let model = function (sequelize) {
  return sequelize.define('mutation', {
    invoiceID: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    productID: {
      type: Sequelize.STRING,
      allowNull: false
    },
    doneAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    info: {
      type: Sequelize.STRING,
      allowNull: false
    },
    type: {
      type: Sequelize.ENUM('Buy', 'Sell'),
      allowNull: false
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    price: {
      type: Sequelize.DOUBLE,
      allowNull: false
    }
  })
}

module.exports = model