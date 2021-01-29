const path = require("path"); 
require("dotenv").config({path: path.resolve(__dirname, './env/.env')});

const eventsConnection = require("./mongodb/eventsConnection");
eventsConnection.init();

const log = new (require("./logger/Logger"))("app")

function exitHandler() {
    log.log("exitHandler", "Closing connections")
    // Close future connections here
    eventsConnection.closeConnection(); 
}

// Exit handlers
process.on('exit', exitHandler);
process.on('SIGINT', exitHandler);
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);
process.on('uncaughtException', exitHandler);