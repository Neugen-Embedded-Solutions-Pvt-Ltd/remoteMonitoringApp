const express = require('express');
const router = express.Router();
const tempratureController = require('../controllers/tempratureController');

// setup temprature 
router.post('/roomtemp',tempratureController.setAutomaticTemprature ); // temparture end-point

module.exports = router