// logs of server activity 

import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";

// security header in API requests
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
export default setupMiddleware;