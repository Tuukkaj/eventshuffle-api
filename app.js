const path = require("path"); 
require("dotenv").config({path: path.resolve(__dirname, './env/.env')});

const log = new (require("./logger/Logger"))("app"); 
const loggerMiddleware = require("./logger/loggerMiddleware");

const app = require("express")();

const port = Number(process.env.EXPRESS_PORT); 

const eventsConnection = require("./mongodb/eventsConnection");
eventsConnection.init();

const useApiV1 = require("./routes/api/v1/useV1"); 

if(!port) {
    throw new Error("EXPRESS_PORT in .env is not a number!");
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

app.use(loggerMiddleware); 

useApiV1(app); 


app.listen(port, function() {
    log.log("app.listen", "Express listening requests at port " + port);
}); 
