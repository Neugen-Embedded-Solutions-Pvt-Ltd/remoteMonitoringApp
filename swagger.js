let swaggerJsdoc= require('swagger-jsdoc')
let swaggerUi = require('swagger-ui-express');
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API',
      description: "API endpoints for a services documented on swagger",
      contact: {
        name: "Manoj",
        email: "manoj4820@neugen.co.in",
        url: "https://github.com/Neugen-Embedded-Solutions-Pvt-Ltd/remoteMonitoringApp.git"
      },
      version: '1.0.0',
    },
    servers: [
      {
        url: "http://localhost:3001/",
        description: "Local server"
      },
      {
        url: "<your live url here>",
        description: "Live server"
      },
    ]
  },
  // looks for configuration in specified directories
  apis: ['./routes/*.js'],
}
const swaggerSpec = swaggerJsdoc(options)
function swaggerDocs(app, port) {
  console.log(port)
  // Swagger PageF
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  // Documentation in JSON format
  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
}
module.exports = swaggerDocs