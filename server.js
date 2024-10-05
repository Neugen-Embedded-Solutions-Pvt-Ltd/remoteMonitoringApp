const express = require('express'); //API craetion
const bodyParser = require('body-parser'); // JSON parser
const swaggerJsdoc = require("swagger-jsdoc"); // swagger API to JSON
const swaggerUi = require("swagger-ui-express"); // UI for API endpoints
const cors = require('cors'); //Cross-Origin Resource Sharing 
const authRoutes = require('./routes/authRoutes'); // Login middleware
const dataRoutes = require('./routes/dataRoutes'); // Temprature middleware
const setupMiddleware = require('./logging/logger'); // logging in terminal
const {verifyToken } = require('./middleware/authMiddleware'); // validate API request for particular endpoints after login
const {handleError } = require('./utils/errorHandler'); // middleware error handler
const {limiter} = require('./middleware/ratelimit'); // prevent network traffic and bot attacks
require('./config/mqtt'); // establish MQTT connection
const config = require('./config/server'); //server port number

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

// API documentation 
const swaggerOption = {
    swaggerDefinition: (swaggerJsdoc.Options = {
        info: {
            version: "3.0.0",
            title: "Remote Monitoring System",
            description: "API documentation",
            contact: {
                name: "Manoj ",
            },
            servers: ["http://localhost:3001/"],
        },
    }),
    apis: ["server.js", "./routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOption);
app.use("/rest-api", swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // API documentation 

 
app.use('/auth', limiter, authRoutes); // login endpoint
app.use('/api', verifyToken, authRoutes); // authorized end-points 

app.use('/iot', dataRoutes); // temprature end-points

app.listen(config.port, () => {
    console.log(`server listening on ${config.port}`); // hosting port number
});