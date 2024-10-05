// common error handling class 

class BaseError extends Error {
    constructor(name, statusCode , isOperational,description ){
        super(description);
        Object.setPrototypeOf(this, new.target.prototype)
        this.name = name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.stackTraceLimit(this)

    }
}

module.exports = BaseError;