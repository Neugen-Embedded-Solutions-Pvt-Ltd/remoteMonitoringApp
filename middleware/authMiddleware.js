const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    try { 

        let token = req.headers.authorization; 
        if (!token) return res.status(403).send({
            auth: false,
            message: 'token not provided'
        });
        token = token.split(" ")[1]; 
        let verfiedUser = jwt.verify(token, process.env.JWT_SECRET);
        if (!verfiedUser) return res.status(403).send({
            message: "Unauthorized request"
        });
        console.log(req.user);
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