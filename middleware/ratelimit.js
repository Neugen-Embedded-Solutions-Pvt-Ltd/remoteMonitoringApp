// setting up requset time duration for security
// to prevent the number requesty from user in particular time
// prevvent network trafic and bot attck
const {rateLimit} = require('express-rate-limit');

const limiter = rateLimit({
    window: 15*60 * 1000, //5 min
    limit : 20,
    standardHeaders: true,
    leagacyHeaders: false
});

module.exports = {limiter}