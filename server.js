import express from "express";
import bodyParser from "body-parser"; // JSON parser
import cors from "cors"; //Cross-Origin Resource Sharing
import path from "path";
import http from "http";
import winston from "winston";
import { fileURLToPath } from "url";

import "./src/config/mqtt.js"; // establish MQTT connection

import AuthRoute from "./src/routes/authRoutes.js"; // Login middleware
import temperatureRoute from "./src/routes/temperatureRoutes.js"; // Temperature middleware
import setupMiddleware from "./logging/logger.js"; // logging in terminal
import swaggerDocs from "./swagger/swagger.js";
import verifyToken from "./src/middleware/authMiddleware.js"; // validate API request for particular endpoints after login
import limiter from "./src/middleware/ratelimit.js"; // prevent network traffic and bot attacks

const app = express(); // initialize express
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const corsOptions = {
  origin: "http://localhost:3000", //(https://your-client-app.com)    allowing particular origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

setupMiddleware(app); // logger and security for API headers
swaggerDocs(app); // Api documentation

// restrict the resources sharing globally
app.use(cors(corsOptions));

app.use(express.json()); // middleware data in the json format
app.use(bodyParser.json()); // parses json data
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
); // parse URL encoded form data -> available in req.body
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

// endpoints
app.use("/auth", limiter, AuthRoute); // login endpoint
app.use("/api", verifyToken, AuthRoute); // authorized end-points
app.use("/iot", temperatureRoute); // temperature end-points

app.get("/", (req, res) => {
  res.send("server is running");
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/home", (req, res) => {
  res.send("This is the Demo page for" + " setting up express server !");
});

const server = http.createServer(app);

// server listening port
server.listen(process.env.SERVICE_PORT, () => {
  console.log(`server listening on ${process.env.SERVICE_PORT}`); // hosting port number
});

// server listening Error handling
server.on("error", (error) => {
  console.error("Server error:", error);
});

export default server;
