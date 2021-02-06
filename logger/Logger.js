const getTime = require("./time"); 
const {logger : winston} = require("./winstonLogger");

/**
 * Constructor function for creating logger wrapper. Takes filename as parameter to use in logging.
 * @param {String} fileName Filename where logger is called
 */
module.exports = function Logger(fileName) {
    // Creates basic info string to use in logs
    function createInfoText() {
        return `[${getTime()}][${fileName}]`
    }

    // Debugging log
    this.debug = function(funcName, text) {
      winston.debug(`${createInfoText()}[${funcName}]: ${text}`);
    }

    // Log / info 
    this.log = function(funcName, text) {
      winston.info(`${createInfoText()}[${funcName}]: ${text}`);
    }

    // Warning logs
    this.warn = function(funcName, text) {
      winston.warn(`${createInfoText()}[${funcName}]: ${text}`);
    }

    // Error logs
    this.error = function(funcName, text) {
      winston.error(`${createInfoText()}[${funcName}]: ${text}`);
    }
}