const express = require('express'); //API craetion
const bodyParser = require('body-parser'); // JSON parser
const cors = require('cors'); //Cross-Origin Resource Sharing 
const authRoutes = require('./routes/authRoutes'); // Login middleware
const dataRoutes = require('./routes/dataRoutes'); // Temprature middleware
const setupMiddleware = require('./logging/logger'); // logging in terminal
const swaggerDocs = require('./swagger/swagger');
const {
    verifyToken
} = require('./middleware/authMiddleware'); // validate API request for particular endpoints after login
const {
    limiter
} = require('./middleware/ratelimit'); // prevent network traffic and bot attacks
require('./config/mqtt'); // establish MQTT connection
const http = require('http');
const app = express(); // initilize express

const server = http.createServer(app);
app.use(cors()); // restric the resources sharing globally

const corsOptions = {
    origin: ['http://localhost:3000', 'https://webapp-qrjh.vercel.app/'], //(https://your-client-app.com)    allowing particular origin 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};

const io = require('socket.io')(server, {
    cors: corsOptions
});

const path = require('path')

setupMiddleware(app); // logging in console
app.use(express.json()); // middileware data in the json format
app.use(bodyParser.json()); // parses json data
app.use(bodyParser.urlencoded({
    extended: false
})); // parse URL encoded form data -> avalible in req.body

swaggerDocs(app); // Api documentation

app.use('/auth', limiter, authRoutes); // login endpoint
app.use('/api', verifyToken, authRoutes); // authorized end-points 
app.use('/iot', dataRoutes); // temprature end-points
app.get('/', (req, res) => {
    res.send('server is running')
})
app.use(express.static(path.join(__dirname, "public")));
server.listen(process.env.SERVICE_PORT, () => {
    console.log(`server listening on ${process.env.SERVICE_PORT}`); // hosting port number
});


app.get('/w', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
io.on('connection', (client) => {
    console.log('User Connected');
    client.on('sendname', (msg) => {
        console.log('Temprature received:', msg)
    });
    client.emit('sendname', "Hello from server")
    client.on('disconnect', function () {
        console.log('user disconnected');
    });
})

module.exports = {
    server,
    app,
};