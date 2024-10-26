// TOken based Authorization

const jwt = require('jsonwebtoken'); // genrate token

// security for API authorization
function verifyToken(req, res, next) {
    try { 
        let token = req.headers.authorization;  // get token from header
        if (!token) return res.status(403).send({
            auth: false,
            message: 'token not provided'
        }); // validate token provided 
        token = token.split(" ")[1]; // seprate the Authorization from token
        let verfiedUser = jwt.verify(token, process.env.JWT_SECRET); //validating with secret key
        if (!verfiedUser) return res.status(403).send({
            message: "Unauthorized request"
        }); //if not authorized not allowed

        req.user = verfiedUser;
        next(); 
    } catch (err) {
        console.error(err);
        res.status(400).send({
            message: 'Invalid Token'
        });
    }
};

module.exports = {
    verifyToken
};