const getTime = require("./time"); 
const winston = require("./winstonLogger");

module.exports = function Logger(fileName) {
    function createInfoText() {
        return `[${getTime()}][${fileName}]`
    }

    this.debug = function(funcName, text) {
      winston.debug(`${createInfoText()}[${funcName}]: ${text}`);
    }

    this.log = function(funcName, text) {
      winston.info(`${createInfoText()}[${funcName}]: ${text}`);
    }

    this.warn = function(funcName, text) {
      winston.warn(`${createInfoText()}[${funcName}]: ${text}`);
    }

    this.error = function(funcName, text) {
      winston.error(`${createInfoText()}[${funcName}]: ${text}`);
    }
}