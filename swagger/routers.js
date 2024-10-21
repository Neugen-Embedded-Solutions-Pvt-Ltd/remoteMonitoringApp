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
 *            properties:
 *              device_id:
 *                type: number
 *                default: 10
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
 *     responses:
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
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
 *              - device_id
 *              - email
 *              - password
 *            properties:
 *              device_id:
 *                type: number
 *                default: 10
 *              email:
 *                type: string
 *                default: johndoe@mail.com
 *              password:
 *                type: string
 *                default: johnDoe20!@
 *     responses:
 *      200:
 *        description: "User logged in successfully"
 *      409:
 *        description: Conflict
 *      400:
 *        description: "Bad request"
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */

/** Temprature */
/**
 * @swagger
 * '/iot/roomtemp':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Setup the temprature
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - typeTemprature
 *              - manualTemparature
 *            properties:
 *              typeTemprature:
 *                type: string
 *                default: slightlyChilled
 *              manualTemparature:
 *                type: number
 *                default: 16
 *     responses:
 *      200:
 *        description: Temprature setup successfully
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
