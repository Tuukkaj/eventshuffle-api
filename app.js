const path = require("path"); 
require("dotenv").config({path: path.resolve(__dirname, './env/.env')});

const log = new (require("./logger/Logger"))("app"); 
const loggerMiddleware = require("./logger/loggerMiddleware");

const app = require("express")();

let port = Number(process.env.EXPRESS_PORT); 

const eventsConnection = require("./mongodb/eventsConnection");
eventsConnection.init();

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

app.get('/', function(req, res) {
    res.send('Hello World!')

});

app.listen(port, function() {
    log.log("app.listen", "Express listening requests at port " + port);
}); 
