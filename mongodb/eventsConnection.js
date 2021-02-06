const MongoClient = require("mongodb").MongoClient; 
const log = new (require("../logger/Logger"))("eventsConnection.js"); 

let connection; 
let clientRef; 

/**
 * Functions related to MongoDb events connection
 */
module.exports = {
    // Inits database connection
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

    /**
     * Returns connection to database. Used for querying events.
     */
    getConnection() {
        if(!connection) {
            throw new Error("Error: getConnection() eventsConnection hasn't been initialized!"); 
        }

        return connection; 
    }, 

    /**
     * Closes connection to database
     */
    closeConnection() {
        if(!connection) {
            throw new Error("Error: closeConnection() eventsConnection hasn't been initialized!"); 
        }

        clientRef.close(() => log.log("closeConnection","eventsConnection closed")); 
    },

    /**
     * Returns database client. Used for closing connection to MongoDb client
     */
    getClient() {
        if(!connection) {
            throw new Error("Error: getClient() eventsConnection hasn't been initialized!"); 
        }

        return clientRef; 
    }
}