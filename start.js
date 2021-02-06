const startApplication = require("./app"); 

/**
 * Starts Express application
 */
startApplication(process.env.MONGO_DB_EVENTS_DATABASE, function(){/* Callback not used*/}); 