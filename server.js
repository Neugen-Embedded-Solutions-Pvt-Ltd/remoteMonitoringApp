import express from 'express'; //API creation
import bodyParser from 'body-parser'; // JSON parser
import cors from 'cors'; //Cross-Origin Resource Sharing 
import path from 'path';
import http from 'http';
import {
    Server
} from 'socket.io';
import {
    fileURLToPath
} from 'url';

import './config/mqtt.js'; // establish MQTT connection

import router from './routes/authRoutes.js'; // Login middleware
import dataRouter from './routes/dataRoutes.js'; // Temprature middleware
import setupMiddleware from './logging/logger.js'; // logging in terminal
import swaggerDocs from './swagger/swagger.js';
import verifyToken from './middleware/authMiddleware.js'; // validate API request for particular endpoints after login
import limiter from './middleware/ratelimit.js'; // prevent network traffic and bot attacks
import temperature from './models/temprature.js'
const app = express(); // initilize express
const server = http.createServer(app);
const __dirname = path.dirname(fileURLToPath(
    import.meta.url));

const corsOptions = {
    origin: '*', //(https://your-client-app.com)    allowing particular origin 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};
const io = new Server(server, {
    cors: corsOptions
});

setupMiddleware(app); // logging in console
swaggerDocs(app); // Api documentation

app.use(cors()); // restric the resources sharing globally
app.use(express.json()); // middileware data in the json format
app.use(bodyParser.json()); // parses json data
app.use(bodyParser.urlencoded({
    extended: false
})); // parse URL encoded form data -> avalible in req.body
app.use(express.static(path.join(__dirname, "public")));

// enpoints
app.use('/auth', limiter, router); // login endpoint
app.use('/api', verifyToken, router); // authorized end-points 
app.use('/iot', dataRouter); // temprature end-points 
app.get('/', (req, res) => {
    res.send('server is running');
})
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

// Create a Socket connection
io.on('connection', (socket) => {
    console.log('User Connected', socket.id);
    
    socket.on('device temperature', async (tempratureData) => {
        await temperature.insertTempratureData(tempratureData); // inserting temperatureF into DB
        tempratureData.id = socket.id; // Add socket ID
        console.log('temperature updated in the DB:', tempratureData);

        // Emit back the response to client
        io.emit('temperature to client', tempratureData);
    });

    // socket got disconnected
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

server.listen(process.env.SERVICE_PORT, () => {
    console.log(`server listening on ${process.env.SERVICE_PORT}`); // hosting port number
});

export default {
    server,
    app
};