import express from "express"; //API creation
import bodyParser from "body-parser"; // JSON parser
import cors from "cors"; //Cross-Origin Resource Sharing
import path from "path";
import http from "http";
import https from "https";
import winston from "winston";
import fs from "fs";
import { Server } from "socket.io";
import { fileURLToPath } from "url";

import "./config/mqtt.js"; // establish MQTT connection

import router from "./routes/authRoutes.js"; // Login middleware
import dataRouter from "./routes/dataRoutes.js"; // Temprature middleware
import setupMiddleware from "./logging/logger.js"; // logging in terminal
import swaggerDocs from "./swagger/swagger.js";
import verifyToken from "./middleware/authMiddleware.js"; // validate API request for particular endpoints after login
import limiter from "./middleware/ratelimit.js"; // prevent network traffic and bot attacks
import temperature from "./models/temprature.js";
const app = express(); // initilize express
const __dirname = path.dirname(fileURLToPath(import.meta.url));

setupMiddleware(app); // logger and security for API headers
swaggerDocs(app); // Api documentation

app.use(cors()); // restric the resources sharing globally
app.use(express.json()); // middileware data in the json format
app.use(bodyParser.json()); // parses json data
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
); // parse URL encoded form data -> avalible in req.body
app.use(express.static(path.join(__dirname, "public")));

// Global Error Handler

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
app.use((err, req, res, next) => {
  logger.error({
    error: err.message,
    stack: err.stack,
    requestId: req.id,
  });
  res.status(500).json({
    error: "Something went wrong",
    requestId: req.id,
  });
});

// enpoints
app.use("/auth", limiter, router); // login endpoint
app.use("/api", verifyToken, router); // authorized end-points
app.use("/iot", dataRouter); // temprature end-points

app.get("/", (req, res) => {
  res.send("server is running");
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/home", (req, res) => {
  res.send("This is the Demo page for" + " setting up express server !");
});

// https crarte key and certificate
const privateKey = fs.readFileSync("private-key.pem", "utf8");
const certificate = fs.readFileSync("certificate.pem", "utf8");
const credentials = { key: privateKey, cert: certificate };

const server = http.createServer(app);

const corsOptions = {
  origin: "*", //(https://your-client-app.com)    allowing particular origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

const io = new Server(server, {
  cors: corsOptions,
});

// Create a Socket connection
io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  socket.on("device temperature", async (tempratureData) => {
    await temperature.insertDeviceTemprature(tempratureData); // inserting temperatureF into DB
    tempratureData.id = socket.id; // Add socket ID
    console.log("temperature updated in the DB:", tempratureData);

    // Emit back the response to client
    io.emit("temperature to client", tempratureData);
  });

  // socket got disconnected
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
});
// function generateTodayDataAndSave() {
//   const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format

//   const todayData = {
//     date: today,
//     temp: 10,
//     tempmax: 10,
//     tempmin: 10,
//     conditions: 'cool',
//   };

//   temprature.insertTemperatureRecord(todayData);
// }
// Call the function every minute
// setInterval(generateTodayDataAndSave, 60 * 1000);
// server listening
server.listen(process.env.SERVICE_PORT, () => {
  console.log(`cloud server listening on ${process.env.SERVICE_PORT}`); // hosting port number
});

// server listening Error handling
server.on("error", (error) => {
  console.error("Server error:", error);
});





export default server;
