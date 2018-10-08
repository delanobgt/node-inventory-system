let express = require('express')
let router = express.Router()
let bcrypt = require('bcrypt-nodejs')
let passport = require('passport')
let LocalStrategy = require('passport-local').Strategy

let db = require('../models/index')

// middlewares import
let auth = require('../middlewares/auth')

const REGISTER_BLOCKED = true

passport.serializeUser((user, done) => {
  done(null, user)
})
passport.deserializeUser((user, done) => {
  done(null, user)
})
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      let foundUser = await db.User.findOne({ where: {email} })
      if (!foundUser) done(null, false)
      else if (bcrypt.compareSync(password, foundUser.password)) done(null, foundUser.dataValues)
      else done(null, false)
    } catch (err) {
      done(null, false)
      console.log(err)
    }
  }
))

router.get('/login', (req, res) => {
  res.render('users/login')
})
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/new', auth.blocked(REGISTER_BLOCKED), (req, res) => {
  res.render('users/new')
})
router.post('/new', auth.blocked(REGISTER_BLOCKED), async(req, res) => {
  let email = req.body.email
  let password = req.body.password
  try {
    let hashedPassword = bcrypt.hashSync(password)
    let createdUser = await db.User.create({ email, password: hashedPassword })
    req.login(createdUser.dataValues, (err) => {
      res.redirect('/')
    })
  } catch (err) {
    res.redirect('back')
    console.log(err)
  }
})

router.get('/logout', auth.isLoggedIn, async (req, res) => {
  req.logout()
  req.session.destroy()
  res.redirect('/users/auth')
})

module.exports = router
