const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../model/user');
const passport = require('passport');
const{storeReturnTo} = require('../middleware');
const {user} = require('../controller/users');

router.route('/register')
    .get(user.renderRegister)
    .post(catchAsync(user.register));
router.route('/login')
    .get(user.renderLogin)
    .post(storeReturnTo,
            passport.authenticate('local',{failureFlash:true, failureRedirect:'/login', failureMessage:true}),
            user.login)

router.get('/logout',user.logout);

module.exports= router;