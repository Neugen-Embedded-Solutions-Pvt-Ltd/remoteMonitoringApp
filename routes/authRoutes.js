const express = require('express');
const router = express.Router();
const app = express();


const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); // verfity the token when get request made
const {
    proxyMiddlwware
} = require('../config/proxy');

router.post('/register', authController.register); //register the user API endpoint   Sample routes-> http://localhost:3000/auth/login

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       description: User object to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               device_id:
 *                 type: integer
 *                 example: 12154654
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 example: "manoj@neugen.co.in"
 *               password:
 *                 type: string
 *                 example: "qweWER12@#"
 *               address:
 *                 type: string
 *                 example: "#23, First Street, Bangalore"
 *               phoneNum:
 *                 type: integer
 *                 example: 9488118284
 *               country:
 *                 type: string
 *                 example: "India"
 *               pincode:
 *                 type: integer
 *                 example: 560012
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 device_id:
 *                   type: integer
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *                 address:
 *                   type: string
 *                 phoneNum:
 *                   type: integer
 *                 country:
 *                   type: string
 *                 pincode:
 *                   type: integer
 *             example:
 *               device_id: 12154654
 *               firstName: "John"
 *               lastName: "Doe"
 *               email: "manoj@neugen.co.in"
 *               password: "qweWER12@#"
 *               phoneNum: 9488118284
 *               address: "#23, First Street, Bangalore"
 *               country: "India"
 *               pincode: 560012
 *       400:
 *         description: Invalid request
 */

router.post('/login', authController.login); // login the user API endpoint
router.post('/sendOtp', authController.sendOtps);

router.get('/weather', proxyMiddlwware);
module.exports = router;