
const dotenv = require('dotenv');

dotenv.config();

const config = {
    port : process.env.SERVICE_PORT,
}

module.exports = config;