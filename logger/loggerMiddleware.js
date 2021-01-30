const getTime = require("./time");
  
module.exports = function loggerMiddleware(req, res, next) {
    res.on("finish", function() {
        console.log(`[${getTime()}][${req.ip}][${req.method}:${req.url}][${res.statusCode}]`);
    }); 

    next(); 
}