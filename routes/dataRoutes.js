const express = require('express');
const router = express.Router();
const tempratureController = require('../controllers/tempratureController');


router.post('/temp',tempratureController.setTemprature );
router.post('/roomtemp',tempratureController.setAutomaticTemprature );

module.exports = router