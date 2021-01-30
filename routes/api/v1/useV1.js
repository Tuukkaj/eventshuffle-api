const eventRouter = require("./event/event");
const { v1Path } = require("./constants"); 

module.exports = function useV1(app) {
    app.use(v1Path, eventRouter); 
    
    // Add future v1 api routes here
}