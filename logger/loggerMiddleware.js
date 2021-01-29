const getTime = require("./time");

function getActualRequestDurationInMilliseconds(start) {
    const NS_PER_SEC = 1e9; //  convert to nanoseconds
    const NS_TO_MS = 1e6; // convert to milliseconds
    const diff = process.hrtime(start);
    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

  
module.exports = function loggerMiddleware(req, res, next) {
    console.log(`[${getTime()}][${req.method}:${req.url}] - ${res.statusCode} (${getActualRequestDurationInMilliseconds}ms)`);
    next(); 
}