const express = require('express');
const router = express.Router();
const tempratureController = require('../controllers/tempratureController');

 
router.post('/roomtemp',tempratureController.setAutomaticTemprature ); // temparture end-point

module.exports = router