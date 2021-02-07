const chai = require("chai"); 
const chaiHttp = require("chai-http"); 
chai.use(chaiHttp); 

/**
 * Constructor function for creating API calls to EventRequests.
 * @param {Express application} app Express application to send requests
 * @param {String} eventUrl Base url of events
 */
module.exports = function EventRequests(app, eventUrl) {
    /**
     * Send list events request
     */
    this.listEvents = async () => {
        return await chai.request(app)
                        .get(`${eventUrl}/list`)
                        .send();
    }

    /**
     * Send create event request
     * @param {Object} reqBody Request body to create event
     */
    this.createEvent = async (reqBody) => {
        return await chai.request(app)
                        .post(`${eventUrl}`)
                        .send(reqBody);
    }

    /**
     * Send show event request
     * @param {String} eventId Id of event
     */
    this.showEvent = async (eventId) => {
        return await chai.request(app)
                        .get(`${eventUrl}/${eventId}`)
                        .send();
    }

    /**
     * Send vote request
     * @param {String} eventId Id of event
     * @param {Object} reqBody Request body to vote event
     */
    this.voteEvent = async (eventId, reqBody) => {
        return await chai.request(app)
                        .post(`${eventUrl}/${eventId}/vote`)
                        .send(reqBody); 
    },

    /**
     * Send request to show results of event
     * @param {String} eventId Id of event 
     */
    this.resultEvent = async (eventId) => {
        return await chai.request(app)
                        .get(`${eventUrl}/${eventId}/results`)
                        .send(); 
    }
}