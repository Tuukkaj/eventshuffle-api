const getTime = require("./time");
  
module.exports = function loggerMiddleware(req, res, next) {
    console.log(`[${getTime()}][${req.method}:${req.url}][${res.statusCode}]`);
    next(); 
}