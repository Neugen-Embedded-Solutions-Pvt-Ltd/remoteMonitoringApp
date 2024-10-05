const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");

function setupMiddleware(app) {
    // Morgan for logging
    app.use(morgan('combined'));

    // Helmet for security headers
    // app.use(helmet());

    // Compression for response compression
    // app.use(compression());

    // Add other middleware as needed
    // app.use(morgan('tiny'));
}

// Export the middleware setup function
module.exports = setupMiddleware;