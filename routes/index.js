const { body, check, validationResult } = require("express-validator");
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/user');
const Message = require('../models/message');

//index
router.get('/', function(req, res, next) {
  includedFields = 'title content';
  if(req.user && req.user.is_member) includedFields = 'title content user timestamp';
  Message.find({})
    .sort({timestamp: -1})
    .populate('user')
    .select(includedFields)
    .exec((err, messages) => {
      if(err) next(err);
      res.render('index', {user: req.user, messages: messages});
    })
});

//secret stuff
router.get('/secret-stuff', function(req, res, next) {
  res.render('secret_stuff', { title: 'Secret Stuff', user: req.user});
});

router.post('/secret-stuff', [
  body('admin_password').escape(),
  body('member_password').escape(),
  (req, res, next) => {
    if(req.body.admin_password === process.env.ADMIN_PASSWORD) {
      User.findByIdAndUpdate(req.session.passport.user, {is_admin: true, is_member: true}, (err, doc) => {
        if (err) next(err)
        else res.redirect('/');
      });
    }
    else if(req.body.member_password === process.env.MEMBER_PASSWORD) {
      User.findByIdAndUpdate(req.session.passport.user, {is_member: true}, (err, doc) => {
        if (err) next(err)
        else res.redirect('/');
      });
    }
    else res.render('secret_stuff', { title: 'Secret Stuff', was_incorrect: true, user: req.user });
  }
]);

//sign up
router.get('/sign-up', function(req, res, next) {
  res.render('sign_up', { title: 'Create a new account', user: req.user });
});

router.post('/sign-up', [
  body('first_name').trim().escape(),
  body('last_name').trim().escape(),
  body('username').trim().escape(),
  check('username', "Username is already taken.").custom(value => {
    return User.findOne({username: new RegExp('^' + value + '$', 'i')})
      .then(user => {
        if(user != null) return Promise.reject("Username is already taken.")
      });
  }),
  check('password_reenter', "Re-entered password needs to match password.").custom((value, {req}) => value === req.body.password),
  (req, res, next) => {
    const errors = validationResult(req);

    let user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: req.body.password,
      is_member: false,
      is_admin: false
    })

    if(!errors.isEmpty()) res.render('sign_up', { title: 'Create a new account', incomplete_user: user, errors: errors.array(), password_reenter: req.body.password_reenter});
    else {
      bcrypt.hash(user.password, 10, (err, hash) => {
        if(err) next(err);
        user.password = hash;
        user.save();
      });
      res.redirect('/');
    }
  }
]);

//login
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login to existing account' });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(500).send();
    if (!user) return res.render('login', {title: 'Login to existing account', error:info.message, attempted_username: req.body.username});
    req.logIn(user, function(err) {
        if (err) return next(err);
        return res.redirect('/');
    });
})(req, res, next);
});

//logout
router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

//create post
router.get('/create-post', function(req, res, next) {
  res.render('create_post', {title: 'Create Post', user: req.user});
});

router.post('/create-post', [
  body('post_title').trim().escape(),
  body('post_content').escape(),
  (req, res, next) => {
    if(!req.user) {
      res.status(403).send("Must be logged in to create posts.");
      next();
    }

    const errors = validationResult(req);

    let message = new Message({
      title: req.body.post_title,
      timestamp: Date.now(),
      user: req.user,
      content: req.body.post_content
    });

    if(!errors.isEmpty()) res.render('create_post', { title: 'Create Post', user: req.user, errors: errors.array()});
    else {
      message.save((err) => {if(err) next(err)})
      res.redirect('/');
    }
  }
]);

//delete post
router.get('/delete-post/:id', function(req, res, next) {
  Message.findById(req.params.id)
  .populate('user')
  .exec((err, message) => {
    if(err) next(err);
    res.render('delete_post', {title: 'Delete Post', user: req.user, message: message});
  })
});

router.post('/delete-post/:id', function(req, res, next) {
  if(!req.user || !req.user.is_admin) {
    res.status(403).send("Must be an admin to delete posts.");
    next();
  }
  else {
    Message.findByIdAndDelete(req.params.id, (err, doc) => {
      if(err) next(err);
      res.redirect('/');
    });
  }
});

module.exports = router;
