// dependencies import
let express = require('express')
let router = express.Router()
let db = require('../models/index')

// middlewares import
let auth = require('../middlewares/auth')



module.exports = router