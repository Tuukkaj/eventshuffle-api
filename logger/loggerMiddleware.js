const getTime = require("./time");  
const {logger : winston} = require("./winstonLogger");
const  logLevels = require("./logLevels");

/**
 * Request logging middleware. Logs all requests and their responses.
 */
module.exports = function loggerMiddleware(req, res, next) {
    res.on("finish", function() {
        if(process.env.LOG_LEVEL >= logLevels.LOG) {
            winston.info(`[${getTime()}][${req.ip}][${req.method}:${req.url}][${res.statusCode}]`);
        }
    }); 

    next(); 
}