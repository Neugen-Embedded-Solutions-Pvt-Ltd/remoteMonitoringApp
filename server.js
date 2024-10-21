const express = require('express'); //API craetion
const bodyParser = require('body-parser'); // JSON parser
const swaggerJSDoc = require("swagger-jsdoc"); // swagger API to JSON
const swaggerUI = require("swagger-ui-express"); // UI for API endpoints
const cors = require('cors'); //Cross-Origin Resource Sharing 
const authRoutes = require('./routes/authRoutes'); // Login middleware
const dataRoutes = require('./routes/dataRoutes'); // Temprature middleware
const setupMiddleware = require('./logging/logger'); // logging in terminal
const {
    verifyToken
} = require('./middleware/authMiddleware'); // validate API request for particular endpoints after login
const {
    handleError
} = require('./utils/errorHandler'); // middleware error handler
const {
    limiter
} = require('./middleware/ratelimit'); // prevent network traffic and bot attacks
require('./config/mqtt'); // establish MQTT connection

const app = express(); // initilize express

setupMiddleware(app); // logging in console

app.use(express.json()); // middileware data in the json format
app.use(bodyParser.json()); // parses json data
app.use(bodyParser.urlencoded({
    extended: false
})); // parse URL encoded form data -> avalible in req.body
app.use(cors()); // restric the resources sharing globally
//routes
const corsOptions = {
    origin: 'http://localhost:3000', //(https://your-client-app.com)    allowing particular origin 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};
app.use(cors(corsOptions)); // implementing the cors
app.use(handleError); // middleware error handler
let swaggerDocs = require('./swagger.js');
// API documentation 
const swaggerDefinition = {
    openapi: '3.0 .0',
    info: {
        title: 'My API',
        version: '1.0 .0',
        description: 'My API Description',
    },
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'], // Path to the API routes in your Node.js application
};

const swaggerSpec = swaggerJSDoc(options);
app.use("/restapi", swaggerUI.serve, swaggerUI.setup(swaggerSpec)); // API documentation 


app.use('/auth', limiter, authRoutes); // login endpoint
app.use('/api', verifyToken, authRoutes); // authorized end-points 

app.use('/iot', dataRoutes); // temprature end-points
let port = process.env.SERVICE_PORT
swaggerDocs(app,port );
app.listen(process.env.SERVICE_PORT, () => {
    console.log(`server listening on ${process.env.SERVICE_PORT}`); // hosting port number
});