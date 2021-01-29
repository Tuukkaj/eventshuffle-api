const MongoClient = require("mongodb").MongoClient; 
const log = new (require("../logger/Logger"))("eventsConnection"); 

let connection; 
let clientRef; 

module.exports = {
    init() {
        if(!connection) {
            MongoClient.connect(process.env.MONGO_DB_URL, {useUnifiedTopology: true}, function(err, client) {
                if(err !== null) {
                    log.error("init","Failed to connect to MongoDB"); 
                    throw err; 
                }
            
                connection = client.db(process.env.MONGO_DB_EVENTS_DATABASE);
                clientRef = client; 
                log.log("init", "MongoDB connected");
            });
        } else {
            throw new Error("Error: eventsConnection has been initialized already!"); 
        }
    },


    getConnection() {
        if(!connection) {
            throw new Error("Error: eventsConnection hasn't been initialized!"); 
        }

        return connection; 
    }, 

    closeConnection() {
        clientRef.close(() => log.log("closeConnection","eventsConnection closed")); 
    }
}