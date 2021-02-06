const getTime = require("./time");  
const {logger : winston} = require("./winstonLogger");
/**
 * Request logging middleware. Logs all requests and their responses.
 */
module.exports = function loggerMiddleware(req, res, next) {
    res.on("finish", function() {
        winston.info(`[${getTime()}][${req.ip}][${req.method}:${req.url}][${res.statusCode}]`);
    }); 

    next(); 
}