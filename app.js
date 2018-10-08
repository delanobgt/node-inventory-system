'use strict'

// dependencies import
require('dotenv').config()
let path = require('path')
let express = require('express')
let bodyParser = require('body-parser')
let methodOverride = require('method-override')
let expressSession = require('express-session')
let passport = require('passport')
let flash = require('connect-flash')
let moment = require('moment')

// middlewares import
let auth = require('./middlewares/auth')

// routes import
let apiRouter = require('./routes/api')
let productsRouter = require('./routes/products')
let mutationsRouter = require('./routes/mutations')
let usersRouter = require('./routes/users')

const app = express()

// view setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// middlewares
app.use(expressSession({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

// middlewares
app.use((req, res, next) => {
  res.locals.info = req.flash('info')
  res.locals.error = req.flash('error')
  res.locals.moment = moment
  if (req.session.passport) res.locals.user = req.session.passport.user
  next()
})

// index
app.get('/', auth.isLoggedIn, (req, res) => {
  res.redirect('/dashboard')
})

// dashboard
app.get('/dashboard', auth.isLoggedIn, (req, res) => {
  res.render('dashboard/dashboard')
})

// other routes
app.use('/api', auth.isLoggedIn, apiRouter)
app.use('/products', auth.isLoggedIn, productsRouter)
app.use('/mutations', auth.isLoggedIn, mutationsRouter)
app.use('/users', usersRouter)

// not found routes
app.get('*', auth.isLoggedIn, (req, res) => {
  res.redirect('/')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log()
  console.log(`App listening on port ${PORT}`)
  console.log('Press CTRL+C to exit.')
  console.log()
})
