const path = require("path"); 
require("dotenv").config({path: path.resolve(__dirname, './env/.env')}); // Init process.env variables

const { initLogger } = require("./logger/winstonLogger"); 
initLogger(process.env); // Initializes Winston logging
const log = new (require("./logger/Logger"))("app.js"); // Create logging object for app.js
const loggerMiddleware = require("./logger/loggerMiddleware"); // Logging middleware

// Localization middleware
const createLocMiddleware = require("./localizations/createLocalizationMiddleware");

const app = require("express")();
const bodyParser = require("body-parser"); 

const port = Number(process.env.EXPRESS_PORT); 

const eventsConnection = require("./mongodb/eventsConnection");

if(!port) {
    throw new Error("EXPRESS_PORT in .env is not a number!");
}


if(process.env.NODE_ENV !== "development" && process.env.NODE_ENV !== "production") {
    log.error("Process enviroment is not defined! Define NODE_ENV variable in /env/.env. Possible values 'development' and 'production'");
    process.exit(); 
}

function exitHandler() {
    log.log("exitHandler", "Closing connections")
    // Close future connections here
    eventsConnection.closeConnection(); 

    process.exit();
}

// Exit handlers
process.on('SIGINT', exitHandler);
process.on('SIGTERM', exitHandler);

async function run(eventDb, callback) {
    await eventsConnection.init(eventDb);

    app.use(bodyParser.json());

    app.use(loggerMiddleware); 
    
    app.use(createLocMiddleware()); 
    
    // Require API
    require("./routes/api/v1/useV1")(app); 
    
    app.listen(port, function() {
        log.log("app.listen", "Express listening requests at port " + port);
        callback(app);
    });
}

module.exports = run;  