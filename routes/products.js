// dependencies import
let express = require('express')
let router = express.Router()
let db = require('../models')

// middlewares import
let auth = require('../middlewares/auth')

router.get('/', async (req, res) => {
  res.render('products/index')
})

router.get('/new/upload/excel', (req, res) => {
  res.render('products/upload-excel')
})

router.get('/api', async (req, res) => {
  try {
    let products = await db.Product.findAll({})
    res.json(products)
  } catch (err) {
    console.log(err)
    res.status(404).json({ msg: 'Cannot get Products data' })
  }
})

router.post('/api', async (req, res) => {
  try {
    let newProduct = await db.Product.create({
      name: req.body.name
    })
    res.json(newProduct)
  } catch (err) {
    console.log(err)
    res.status(404).json({
      msg: 'Error/Duplicate Product'
    })
  }
})

router.post('/api/bulk', async (req, res) => {
  try {
    console.log(req.body.products)
    res.json({})
  } catch (err) {
    console.log(err)
    res.status(404).json({
      msg: 'Error/Duplicate Product'
    })
  }
})

router.put('/api/:productID', async (req, res) => {
  try {
    let product = await db.Product.findOne({
        where: { id: req.params.productID }
      })
    await product.set('name', req.body.name)
    await product.save()
    res.json(product)
  } catch (err) {
    console.log(err)
    res.status(404).json({ msg: 'Error/Duplicate data' })
  }
})

router.delete('/api/:productID', async (req, res) => {
  try {
    await db.Product.destroy({
      where: { id: req.params.productID }
    })
    res.json({ success: true })
  } catch (err) {
    console.log(err)
    res.status(404).json({ msg: 'Failed to delete' })
  }
})

module.exports = router
