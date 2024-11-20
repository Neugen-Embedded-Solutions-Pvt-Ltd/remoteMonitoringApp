import express from 'express';
import authController from '../controllers/authController.js';
import weatherApi from '../config/weatherApi.js'

const router = express.Router();
// Verify handlers exist before adding routes
if (typeof authController.register !== 'function') {
    throw new Error('authController.register is not a function');
}

if (typeof authController.login !== 'function') {
    throw new Error('authController.login is not a function');
}

if (typeof authController.GetAllUsers !== 'function') {
    throw new Error('authController.GetAllUsers is not a function');
}

if (typeof weatherApi !== 'function') {
    throw new Error('weatherApi is not a function');
}
router.post('/register', authController.register); //register the user API endpoint   Sample routes-> http://localhost:3000/auth/login
router.post('/login', authController.login); // login the user API endpoint
router.get('/alldata', authController.GetAllUsers); // login the user API endpoint

router.get('/weather', weatherApi); // teting purpose

export default router;