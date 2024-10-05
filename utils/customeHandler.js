// Each error class error 

const CustomeError = require('./customeError');
const statusCodes = require('./statusCodes');

class Api404Error extends CustomeError {
    constructor(name, statusCode = statusCodes.NOT_FOUND , isOperational=true , description= "Not found") {
        super(name, statusCode, isOperational, description);
    }
}
class BadRequest400Error extends CustomeError{
    constructor(name, statusCode= statusCodes.BAD_REQUEST, isOperational=true, description= "Bad request"){
        super(name, statusCode, isOperational, description);
    }
}
module.exports = Api404Error;