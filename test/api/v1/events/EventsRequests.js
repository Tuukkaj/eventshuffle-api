const chai = require("chai"); 
const chaiHttp = require("chai-http"); 
chai.use(chaiHttp); 

module.exports = function EventRequests(app, eventUrl) {
    this.listEvents = async () => {
        return await chai.request(app)
                        .get(`${eventUrl}/list`)
                        .send();
    }

    this.createEvent = async (reqBody) => {
        return await chai.request(app)
                        .post(`${eventUrl}`)
                        .send(reqBody);
    }

    this.showEvent = async (eventId) => {
        return await chai.request(app)
                        .get(`${eventUrl}/${eventId}`)
                        .send();
    }

    this.voteEvent = async (eventId, reqBody) => {
        return await chai.request(app)
                        .post(`${eventUrl}/${eventId}/vote`)
                        .send(reqBody); 
    },

    this.resultEvent = async (eventId) => {
        return await chai.request(app)
                        .get(`${eventUrl}/${eventId}/results`)
                        .send(); 
    }
}