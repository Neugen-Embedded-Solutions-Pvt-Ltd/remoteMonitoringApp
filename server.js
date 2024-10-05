const express = require('express'); //API craetion
const bodyParser = require('body-parser'); // JSON parser
const swaggerJsdoc = require("swagger-jsdoc"); // swagger API to JSON
const swaggerUi = require("swagger-ui-express"); // UI for API endpoints
const cors = require('cors'); //Cross-Origin Resource Sharing 
const authRoutes = require('./routes/authRoutes'); // Loginmiddleware
const dataRoutes = require('./routes/dataRoutes'); // Loginmiddleware
const setupMiddleware = require('./logging/logger'); // logging in terminal
const {
    verifyToken
} = require('./middleware/authMiddleware');
const {
    handleError
} = require('./utils/errorHandler')

const {
    limiter
} = require('./middleware/ratelimit')
require('./config/mqtt');
const config = require('./config/server'); //sever port number

const app = express();

setupMiddleware(app); //logging middleware

app.use(express.json()); //midddileware data format in json format
app.use(bodyParser.json()); //paseses json 
app.use(bodyParser.urlencoded({
    extended: false
})); // parse URL encoded form data -> avalible in req.body
app.use(cors()); //One domain to interact with resources from other domains
//routes
const corsOptions = {
    origin: 'http://localhost:3000', //(https://your-client-app.com)     
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};
app.use(cors(corsOptions));
app.use(handleError);


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
app.use("/rest-api", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use('/auth', limiter, authRoutes);
app.use('/api', verifyToken, authRoutes);

app.use('/iot', dataRoutes);

app.listen(config.port, () => {
    console.log(`server listening on ${config.port}`)
});