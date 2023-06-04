const {Router} = require('express')
const sessionController= require('../controller/session.controller')
const passport = require('passport')
const passportCustom = require('../utils/passportCall')
const { REGISTER_STRATEGY, LOGIN_STRATEGY, JWT_STRATEGY, GITHUB_STRATEGY } = require('../config/config')
const { adminPermission } = require('../utils/middleware/isUser')
const router = Router()


//login
router.post('/register', passport.authenticate(REGISTER_STRATEGY,{session:false}), sessionController.loginRegister)

//register
router.post('/login',passport.authenticate(LOGIN_STRATEGY,{session:false}), sessionController.sessionLogin)

//Forgot
router.post('/forgotPassword',sessionController.forgotPassword)
router.post('/forgotrecovery/:token',sessionController.forgotrecovery)

//user premium
router.post('/premium/:uid',sessionController.roleChange)

//current
router.get('/current',passportCustom(JWT_STRATEGY),adminPermission, sessionController.getCurrent)

router.get('/github', passport.authenticate(GITHUB_STRATEGY , {scope: ["user:email"]}))
router.get('/github/callback' , passport.authenticate(GITHUB_STRATEGY , {failureRedirect: "/login"}) , sessionController.github);


module.exports = router;