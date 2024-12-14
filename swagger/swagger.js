import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API",
      description: "API endpoints for a services documented on swagger",
      contact: {
        name: "Manoj",
        email: "manoj4820@neugen.co.in",
        url: "https://github.com/Neugen-Embedded-Solutions-Pvt-Ltd/remoteMonitoringApp.git",
      },
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3001/",
        description: "Local server",
      },
      {
        url: "https://remote-backend.onrender.com",
        description: "Live server",
      },
    ],
  },
  // looks for configuration in specified directories
  apis: ["./swagger/*.js"],
};
const swaggerSpec = swaggerJsdoc(options);
function swaggerDocs(app) {
  // Swagger PageF
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // Documentation in JSON format
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}
export default swaggerDocs;
