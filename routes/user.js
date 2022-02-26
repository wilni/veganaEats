const express = require('express');
const router = express.Router();
const catchAsync = require('../utility/catchAsync');
const ExpressError = require('../utility/ExpressError');
const isLoggedIn = require('../utility/isLoggedIn');
const User = require('../models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');


router.get('/', catchAsync(async(req, res) => {
    res.render('user/login');
}));

router.post('/', passport.authenticate('local', {failureFlash: true, failureRedirect: '/admin'}), (req, res) => {
req.flash('success', "Welcome Back!");
const redirectUrl = req.session.returnTo || '/recipes';
delete req.session.returnTo;
res.redirect(redirectUrl);
});

router.get('/logout', catchAsync(async(req, res, next)=> {
    req.logout();
    req.flash('success', 'sucessfully logged out!');
    res.redirect('/recipes');
}));

module.exports = router;
