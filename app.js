const path = require("path"); 
require("dotenv").config({path: path.resolve(__dirname, './env/.env')});

const eventsConnection = require("./mongodb/eventsConnection");
eventsConnection.init();

function exitHandler() {
    console.log("Exit handler");

    // Close future connections here
    eventsConnection.closeConnection(); 
}

// Exit handlers
process.on('exit', exitHandler);
process.on('SIGINT', exitHandler);
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);
process.on('uncaughtException', exitHandler);