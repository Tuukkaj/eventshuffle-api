const e = require('express');
const winston = require('winston');

const LOG_TYPE = {
  FILE: 0,
  CONSOLE: 1,
  BOTH: 2
}

// Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [],
});

// For some reason process.env.NODE_ENV doesn't manage to load in time when this if statement would have been called normally in this file without export.
// So to get NODE_ENV information to the transport information setup, this function must be called in app.js after process.env has been initialized
const initLogger = function(env) {
  if(env.LOG_TYPE == LOG_TYPE.CONSOLE || env.LOG_TYPE == LOG_TYPE.BOTH) {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
  }

  if(env.LOG_TYPE == LOG_TYPE.FILE || env.LOG_TYPE == LOG_TYPE.BOTH) {
    logger.add(new winston.transports.File({ filename: env.LOG_PATH_ERROR, level: 'error' }));
    logger.add(new winston.transports.File({ filename: env.LOG_PATH_ALL }));
  }    
}

exports.initLogger = initLogger;
exports.logger = logger;