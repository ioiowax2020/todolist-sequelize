const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')


const db = require('../../models')
const Todo = db.Todo
const User = db.User

router.get('/users/login', (req, res) => {
  res.render('login')
})

router.post('/users/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/users/register', (req, res) => {
  res.render('register')
})


//register, logic part
router.post('/users/register', (req, res) => {

  const { name, email, password,
    confirmPassword } = req.body
  User.findOne({ where: { email } }).then(user => {
    if (user) {
      console.log('User already exists')
      return res.render('register', {
        name,
        email,
        password,
      })
    }
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })

})

router.get('/users/logout', (req, res) => {
  req.logOut()
  req.flash('success_msg', 'You have logged out successfully .')
  res.redirect('/users/login')
})


module.exports = router