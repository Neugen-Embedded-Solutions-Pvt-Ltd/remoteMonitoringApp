/** Register */
/**
 * @swagger
 * '/auth/register':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Create a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - device_id
 *              - firstName
 *              - lastName
 *              - email
 *              - password
 *              - username
 *            properties:
 *              device_id:
 *                type: number
 *                default: 1
 *              firstName:
 *                type: string
 *                default: john
 *              lastName:
 *                type: string
 *                default: doe
 *              email:
 *                type: string
 *                default: johndoe@mail.com
 *              password:
 *                type: string
 *                default: johnDoe20!@
 *              username:
 *                type: string
 *                default: Jhon
 *     responses:
 *      201:
 *        description: User created successfully
 *      409:
 *        description: User already exist
 *      404:
 *        description: Device is not registered
 *      500:
 *        description: Server Error
 */

/** Login */
/**
 * @swagger
 * '/auth/login':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Login a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - username
 *              - password
 *            properties:
 *              username:
 *                type: string
 *                default: manoj
 *              password:
 *                type: string
 *                default: manoj20!@
 *     responses:
 *      200:
 *        description: "User logged in successfully"
 *      403:
 *        description: Invalid credentials.
 *      400:
 *        description: Bad request
 *      404:
 *        description: User not found
 *      500:
 *        description: Server Error
 */

/** get all users data */
/**
 * @swagger
 * '/auth/alldata':
 *  get:
 *     tags:
 *     - User Controller
 *     summary: All users data
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *     responses:
 *      200:
 *        description: All users data
 *      400:
 *        description: No users data
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */


/** Forgot Password */
/**
 * @swagger
 * '/auth/forgotpassword':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Generate link for reset password
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - username
 *            properties:
 *              username:
 *                type: text
 *                default: a
 *     responses:
 *      200:
 *        description: reset password link sent to your email
 *      409:
 *        description: User not found, create new account
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */

/** Reset Password */
/**
 * @swagger
 * '/auth/resetpassword':
 *  put:
 *     tags:
 *     - User Controller
 *     summary: Reset password from email link
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - password
 *            properties:
 *              password:
 *                type: password
 *                default: 12
 *              token:
 *                type: string
 *                default: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IndxIiwiaWF0IjoxNzMzODQyODkxLCJleHAiOjE3MzM5MjkyOTF9.W6LMP82XWFFqvqL5IMHecbiyQMQpom0iqpU4YPrPaKA
 *     responses:
 *      200:
 *        description: Password updated successfully
 *      403:
 *        description: Invalid token
 *      409:
 *        description: User not found, create new account
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
