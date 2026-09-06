const express = require('express');
const router = express.Router();

const { register } = require('../controllers/loginRegisterControllers.js/register');
const  sendOTP  = require('../controllers/authcontrollers.js').sendOTP;
const { verifyOTP } = require('../controllers/authcontrollers.js');
const { login } = require('../controllers/loginRegisterControllers.js/login');

const {forgotPassword, resetPassword,changePassword} = require('../controllers/forget&resetPassword.js');
const { auth } = require('../middlewares/auth.js');



router.post('/register', register);
router.post('/auth/send-otp', sendOTP);
router.post('/auth/verify-otp', verifyOTP);
router.post('/auth/login', login);

router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPassword);
router.post('/auth/change-password',auth, changePassword);

router.get('/', (req, res) => {
    res.send('Hello from the route!');
});

module.exports = router;
