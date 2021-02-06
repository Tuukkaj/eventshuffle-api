const winston = require('winston');

// Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [],
});

// For some reason process.env.NODE_ENV doesn't manage to load in time when this if statement would have been called normally in this file without export.
// So to get NODE_ENV information to the transport information setup, this function must be called in app.js after process.env has been initialized
const initLogger = function(nodeEnv) {
  if(nodeEnv !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
  } else {
    logger.add(new winston.transports.File({ filename: 'logs/error.log', level: 'error' }));
    logger.add(new winston.transports.File({ filename: 'logs/combined.log' }));
  }
}

exports.initLogger = initLogger;
exports.logger = logger;