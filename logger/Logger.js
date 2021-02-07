const  logLevels = require("./logLevels");
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
      if(process.env.LOG_LEVEL >= logLevels.DEBUG) {
        winston.debug(`${createInfoText()}[${funcName}]: ${text}`);
      }
    }

    // Log / info 
    this.log = function(funcName, text) {
      if(process.env.LOG_LEVEL >= logLevels.LOG) {
        winston.info(`${createInfoText()}[${funcName}]: ${text}`);
      }
    }

    // Warning logs
    this.warn = function(funcName, text) {
      if(process.env.LOG_LEVEL >= logLevels.WARNING) {
        winston.warn(`${createInfoText()}[${funcName}]: ${text}`);
      }
    }

    // Error logs
    this.error = function(funcName, text) {
      if(process.env.LOG_LEVEL >= logLevels.ERROR) {
        winston.error(`${createInfoText()}[${funcName}]: ${text}`);
      }
    }
}