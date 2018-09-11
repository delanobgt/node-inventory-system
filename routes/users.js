let express = require('express')
let router = express.Router()
let bcrypt = require('bcrypt')
let passport = require('passport')
let LocalStrategy = require('passport-local').Strategy

let db = require('../models/index')

// middlewares import
let auth = require('../middlewares/auth')

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

router.get('/new', auth.blocked(true), (req, res) => {
  res.render('users/new')
})
router.post('/new', auth.blocked(true), async(req, res) => {
  let email = req.body.email
  let password = req.body.password
  try {
    let hashedPassword = await bcrypt.hash(password, parseInt(process.env.USER_SALT_ROUNDS))
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
