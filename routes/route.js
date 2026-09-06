const express = require('express');

const router = express.Router();

const { register } = require('../controllers/loginRegisterControllers.js/register');

const sendOTP = require('../controllers/authcontrollers.js').sendOTP;

const { verifyOTP } = require('../controllers/authcontrollers.js');

const { login } = require('../controllers/loginRegisterControllers.js/login');

const {
    forgotPassword,
    resetPassword,
    changePassword
} = require('../controllers/forget&resetPassword.js');

const { auth } = require('../middlewares/auth.js');


// =======================
// AUTH ROUTES
// =======================

router.post('/register', register);

router.post('/auth/send-otp', sendOTP);

router.post('/auth/verify-otp', verifyOTP);

router.post('/auth/login', login);

router.post('/auth/forgot-password', forgotPassword);

router.post('/auth/reset-password', resetPassword);

router.post('/auth/change-password', auth, changePassword);


// =======================
// COMPLEX ROUTES
// =======================

const { createComplex } = require('../controllers/complex/createComplex.js');
const { getMyComplexes } = require('../controllers/complex/getMyComplex.js');
const { updateComplex } = require('../controllers/complex/updateComplex.js');
const { inactiveComplex } = require('../controllers/complex/inAciveComplex.js');
const { isOwner } = require('../middlewares/auth.js');



// Create Complex
router.post(
    '/createcomplex',
    auth,
    isOwner,
    createComplex
);


// Get My Complexes
router.get(
    '/getcomplex',
    auth,
    isOwner,
    getMyComplexes
);


// Update Complex
router.put(
    '/updatecomplex/:id',
    auth,
    isOwner,
    updateComplex
);


// Make Complex Inactive
router.patch(
    '/complex/:id/inactive',
    auth,
    isOwner,
    inactiveComplex
);


// =======================
// TEST ROUTE
// =======================

router.get('/', (req, res) => {
    res.send('Hello from the route!');
});


module.exports = router;