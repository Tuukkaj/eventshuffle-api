const MongoClient = require("mongodb").MongoClient; 
const log = new (require("../logger/Logger"))("eventsConnection.js"); 

let connection; 
let clientRef; 

module.exports = {
    async init(eventDb) {
        if(!connection) {
            try {
                const client = await MongoClient.connect(process.env.MONGO_DB_URL, {useUnifiedTopology: true}); 

                if(!client) {
                    log.error("init","Failed to connect to MongoDB"); 
                    throw new Error("Error: Failed to initialize eventsConnection!");  
                    process.exit()
                }
                
                connection = client.db(eventDb);
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
            throw new Error("Error: getConnection() eventsConnection hasn't been initialized!"); 
        }

        return connection; 
    }, 

    closeConnection() {
        if(!connection) {
            throw new Error("Error: closeConnection() eventsConnection hasn't been initialized!"); 
        }

        clientRef.close(() => log.log("closeConnection","eventsConnection closed")); 
    },

    getClient() {
        if(!connection) {
            throw new Error("Error: getClient() eventsConnection hasn't been initialized!"); 
        }

        return clientRef; 
    }
}