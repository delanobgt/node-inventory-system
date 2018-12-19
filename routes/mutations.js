// dependencies import
let express = require('express')
let router = express.Router()
let moment = require('moment')
let Op = require('sequelize').Op;
let db = require('../models')

// middlewares import
let auth = require('../middlewares/auth')

router.get('/', async (req, res) => {
  try {
    let products = await db.Product.findAll()
    res.render('mutations/index', {
      products
    })
  } catch (err) {
    console.log(err)
    res.redirect('back')
  }
})

router.get('/new', async (req, res) => {
  try {
    let products = await db.Product.findAll()
    res.render('mutations/new', {
      products
    })
  } catch (err) {
    console.log(err)
    res.redirect('back')
  }
})

router.get('/new/upload/excel', (req, res) => {
  res.render('mutations/upload-excel')
})

router.get('/api', async (req, res) => {
  try {
    let mutations = await db.Mutation.findAll({
      include: [{
        model: db.Product,
        required: true,
        where: {
        name: { [Op.like] : req.query.productName || '%' }
        }
      }],
      where: {
        doneAt: {
          [Op.gte]: moment(req.query.txtStartDate || '1990-01-01').toDate(),
          [Op.lt]: moment(req.query.txtEndDate).add(1, 'days').toDate()
        }
      }
    })
    res.json(mutations)
  } catch (err) {
    console.log(err)
    res.status(422).json({
      msg: 'Cannot get Mutations data'
    })
  }
})

router.post('/api', async (req, res) => {
  try {
    let product = await db.Product.findOne({
      where: {
        name: req.body.productName
      }
    })
    if (!product) {
      res.status(422).json({
        msg: `product not found: ${req.body.productName}`,
        productName: req.body.productName
      })
    }
    let newMutation = await db.Mutation.create({
      invoiceID: req.body.invoiceID,
      productID: product.id,
      doneAt: req.body.doneAt,
      info: req.body.info,
      type: req.body.type,
      quantity: req.body.quantity,
      price: req.body.price || 0
    })
    res.json(newMutation)
  } catch (err) {
    console.log(err)
    res.status(422).json({
      msg: 'Error/Duplicate Mutation'
    })
  }
})

router.post('/api/bulk', async (req, res) => {
  try {
    console.log('LEN', req.body.mutations.length)
    let productID = {}
    let products = await db.Product.findAll()
    products.forEach(product => { productID[product.name] = product.id })

    let newMutations = []
    for (let mutation of req.body.mutations) {
      try {
        mutation.productID = productID[mutation.productName]
        newMutations.push(await db.Mutation.create(mutation))
      } catch (err) { console.log(err) }
    }
    res.json(newMutations)
  } catch (err) {
    console.log(err)
    res.status(404).json({
      msg: 'Error/Duplicate Mutation'
    })
  }
})

router.put('/api/:mutationID', async (req, res) => {
  try {
    let product = await db.Product.findOne({
      where: {
        name: req.body.productName
      }
    })
    let mutation = await db.Mutation.findOne({
      where: {
        id: req.params.mutationID
      }
    })
    mutation.set('invoiceID', req.body.invoiceID)
    mutation.set('productID', product.id)
    mutation.set('doneAt', req.body.doneAt)
    mutation.set('info', req.body.info)
    mutation.set('type', req.body.type)
    mutation.set('quantity', req.body.quantity)
    mutation.set('price', req.body.price || -1)
    await mutation.save()
    res.json(mutation)
  } catch (err) {
    console.log(err)
    res.status(404).json({
      msg: 'Error/Duplicate Mutation'
    })
  }
})

router.delete('/api/:mutationID', async (req, res) => {
  try {
    await db.Mutation.destroy({
      where: {
        id: req.params.mutationID
      }
    })
    res.json({
      success: true
    })
  } catch (err) {
    console.log(err)
    res.status(404).json({
      msg: 'Failed to delete Mutation'
    })
  }
})

router.get('/initial-balance', async (req, res) => {
  try {
    let products = await db.Product.findAll()
    res.render('mutations/initial-balance', {
      products
    })
  } catch (err) {
    console.log(err)
    res.redirect('back')
  }
})

router.get('/api/initial-balance', async (req, res) => {
  const { productName } = req.query
  try {
    let initialMutation = await db.Mutation.findOne({
      where: {
        invoiceID: `##INITIAL[${productName}]##`
      }
    })
    initialMutation = initialMutation || {
      invoiceID: `##INITIAL[${productName}]##`,
      price: 0,
      quantity: 0
    }
    res.json(initialMutation)
  } catch (err) {
    console.log(err)
    res.status(404).json({ error: true })
  }
})

router.post('/api/initial-balance', async (req, res) => {
  const { productName } = req.body
  try {
    let product = await db.Product.findOne({
      where: {
        name: productName
      }
    })
    let initialMutation = await db.Mutation.findOne({
      where: {
        invoiceID: `##INITIAL[${productName}]##`
      }
    })
    if (!initialMutation) initialMutation = new db.Mutation()
    initialMutation.set('invoiceID', `##INITIAL[${productName}]##`)
    initialMutation.set('productID', product.id)
    initialMutation.set('doneAt', '1990-01-01')
    initialMutation.set('info', '##INITIAL##')
    initialMutation.set('type', 'Buy')
    initialMutation.set('quantity', req.body.quantity)
    initialMutation.set('price', req.body.price)
    await initialMutation.save()
    res.json(initialMutation)
  } catch (err) {
    console.log(err)
    res.status(404).json({
      msg: 'Error Initial Balance'
    })
  }
})

router.get('/report', async (req, res) => {
  try {
    res.render('mutations/report', {
      txtStartDate: req.query.txtStartDate,
      txtEndDate: req.query.txtEndDate,
      productName: req.query.productName
    })
  } catch (err) {
    console.log(err)
    res.redirect('back')
  }
})

router.get('/summary', async (req, res) => {
  try {
    res.render('mutations/summary', {
      txtStartDate: req.query.txtStartDate,
      txtEndDate: req.query.txtEndDate
    })
  } catch (err) {
    console.log(err)
    res.redirect('back')
  }
})

module.exports = router