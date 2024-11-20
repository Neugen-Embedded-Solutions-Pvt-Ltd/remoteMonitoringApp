import express from 'express';

const dataRouter = express.Router();
import tempratureController from '../controllers/tempratureController.js';
import tempController from '../controllers/tempAllData.js';
 
// dataRouter.post('/roomtemp', tempratureController.setAutomaticTemprature); // temparture end-point
dataRouter.post('/tempall', tempController.getTempratureAllData); // temparture report genration
dataRouter.get('/temp', tempController.tempratureData); // all tempratur data for chart

export default  dataRouter;