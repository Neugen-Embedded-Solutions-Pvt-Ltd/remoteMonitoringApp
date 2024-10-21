// setting up request time duration for security
// to prevent the number request from user in less time
// prevent network trafic and bot attack
const {rateLimit} = require('express-rate-limit');
// make request limiter, in 15 mins 20 requests allowed
const limiter = rateLimit({
    window: 15*60 * 1000, //5 min
    limit : 20,
    standardHeaders: true,
    leagacyHeaders: false
});

module.exports = {limiter}