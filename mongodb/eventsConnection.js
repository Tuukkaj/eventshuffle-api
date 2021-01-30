const MongoClient = require("mongodb").MongoClient; 
const log = new (require("../logger/Logger"))("eventsConnection"); 

let connection; 
let clientRef; 

module.exports = {
    async init() {
        if(!connection) {
            try {
                const client = await MongoClient.connect(process.env.MONGO_DB_URL, {useUnifiedTopology: true}); 

                if(!client) {
                    log.error("init","Failed to connect to MongoDB"); 
                    throw new Error("Error: Failed to initialize eventsConnection!");  
                    process.exit()
                }
                
                connection = client.db(process.env.MONGO_DB_EVENTS_DATABASE);
                clientRef = client; 
                log.log("init", "MongoDB connected");
            } catch(e) {
                log.error(e)
                process.exit()
            }
            
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