const express = require('express');
const router = express.Router();

const { register } = require('../controllers/loginRegisterControllers.js/register');


router.post('/register', register);
router.get('/', (req, res) => {
    res.send('Hello from the route!');
});

module.exports = router;