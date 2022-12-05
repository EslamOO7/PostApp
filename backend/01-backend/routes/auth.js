const express = require("express");
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../model/user');
const isAuth = require('../middleware/isAuth');

const router = express.Router();


router.put('/signup',[
    check('email')
    .isEmail()
    .withMessage('Please enter your email')
    .custom((value,{req}) => {
        return User.findOne({email: value}).then(userDoc=>{
            if(userDoc){
                return Promise.reject('Email address already exists!!')
            }
        })
    }).normalizeEmail(),
    check('password').trim().isLength({ min: 5 }),
    check('name').trim().notEmpty()
],authController.signup);

router.post('/login',authController.login)

router.get('/status', isAuth, authController.getUserStatus);

router.patch('/status',isAuth,[body('status').trim().not().isEmpty()],authController.updateUserStatus);

module.exports = router