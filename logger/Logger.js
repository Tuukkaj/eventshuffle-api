const getTime = require("./time"); 

module.exports = function Logger(fileName) {
    function createInfoText(type) {
        return `[${getTime()}][${type}][${fileName}]`
    }

    this.info = function(funcName, text) {
        console.info(`${createInfoText("info")}[${funcName}]: ${text}`);
    }

    this.log = function(funcName, text) {
        console.log(`${createInfoText("log")}[${funcName}]: ${text}`);
    }

    this.warn = function(funcName, text) {
        console.warn(`${createInfoText("warn")}[${funcName}]: ${text}`);
    }

    this.error = function(funcName, text) {
        console.error(`${createInfoText("error")}[${funcName}]: ${text}`);
    }
}