import express from "express";
import bodyParser from "body-parser"; // JSON parser
import cors from "cors"; //Cross-Origin Resource Sharing
import path from "path";
import http from "http";
import winston from "winston";
import { fileURLToPath } from "url";
import "./src/config/mqtt.js";
import AuthRoute from "./src/routes/authRoutes.js";
import temperatureRoute from "./src/routes/temperatureRoutes.js";
import setupMiddleware from "./logging/logger.js";
import swaggerDocs from "./swagger/swagger.js";
import verifyToken from "./src/middleware/authMiddleware.js";
import limiter from "./src/middleware/ratelimit.js";

const app = express(); // initialize express
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const corsOptions = {
  origin: "http://localhost:3000", //(https://your-client-app.com)    allowing particular origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
setupMiddleware(app);
swaggerDocs(app);
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(express.static(path.join(__dirname, "public")));
// Error logs stores in file
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
// logging error in console
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
app.use("/auth", limiter, AuthRoute);
app.use("/api", verifyToken, AuthRoute);
app.use("/iot", temperatureRoute);

app.get("/", (req, res) => {
  res.send("server is running");
});
const server = http.createServer(app);
server.listen(process.env.SERVICE_PORT, () => {
  console.log(`server listening on ${process.env.SERVICE_PORT}`); // hosting port number
});
server.on("error", (error) => {
  console.error("Server error:", error);
});
export default server;
