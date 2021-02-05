const getTime = require("./time");  
const winston = require("./winstonLogger");

module.exports = function loggerMiddleware(req, res, next) {
    res.on("finish", function() {
        winston.info(`[${getTime()}][${req.ip}][${req.method}:${req.url}][${res.statusCode}][]`);
    }); 

    next(); 
}