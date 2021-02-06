const eventRouter = require("./event/event");
const { v1Path } = require("./constants"); 

/**
 * Adds V1 routing to given Express application
 * @param {Express application} app Express application to add routes 
 */
module.exports = function useV1(app) {
    app.use(v1Path, eventRouter); 
    
    // Add future v1 api routes here
}