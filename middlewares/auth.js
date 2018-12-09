function blocked(blocked) {
  return function (req, res, next) {
    if (blocked) res.redirect('back')
    else next()
  }
}

function isLoggedIn(req, res, next) {
  return next()
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/users/login')
  }
}

module.exports = {
  blocked,
  isLoggedIn
}