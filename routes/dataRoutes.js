const express = require('express');
const router = express.Router();
const tempratureController = require('../controllers/tempratureController');
const tempController = require('../controllers/tempAllData');

router.post('/roomtemp', tempratureController.setAutomaticTemprature); // temparture end-point
router.post('/tempall', tempController.getTempratureAllData); // temparture report genration
router.get('/temp', tempController.tempratureData); // all tempratur data for chart

module.exports = router