const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { weatherApi } = require('../config/weatherApi');


router.post('/register', authController.register); //register the user API endpoint   Sample routes-> http://localhost:3000/auth/login
router.post('/login', authController.login); // login the user API endpoint
router.get('/alldata', authController.GetAllUsers); // login the user API endpoint

router.get('/weather', weatherApi); // teting purpose

module.exports = router;