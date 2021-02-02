let app; 
let eventRequests; 

const { assert } = require("chai");
const chai = require("chai"); 
const chaiHttp = require("chai-http"); 
chai.should(); 
chai.use(chaiHttp); 

const { getClient, getConnection } = require("../../../../mongodb/eventsConnection");

const {v1Path, eventPath} = require("../../../../routes/api/v1/constants"); 
const eventTestData = require("./eventTestData");
const URL = v1Path + eventPath;

const testData = require("./eventTestData");

before(function(done) {
    const onAppLoaded = startedApp => {
        app = startedApp;
        eventRequests = new (require("./EventsRequests"))(app, URL);
        done();
    }

    const d = new Date(); 
    const dateString = `${d.getUTCFullYear()}_${d.getUTCMonth()}_${d.getUTCDate()}__${d.getUTCHours()}_${d.getUTCMinutes()}_${d.getUTCSeconds()}_${d.getUTCMilliseconds()}`;

    require("../../../../app")(process.env.MONGO_DB_TEST_EVENTS_DATABASE + dateString, onAppLoaded); 
});

describe("Events API - successful use case", function() {
    // Check that /list works and that database is empty / new
    it("List empty events", async () => {
        const {status, body} = await eventRequests.listEvents();
        status.should.eql(200, "List command should have status 200");
        body.events.should.a("array", "Retured list should be an array");
        body.events.length.should.eql(0, "List's length should be 0 as database is new");
    }); 

    // Test that create works and correct id is returned after
    it("Create, find, vote and show results of event", async () => {
        const redWeddingEvent = testData.successfulUseCase;  
    
        const {status: createStatus, body: createBody} = await eventRequests.createEvent(redWeddingEvent.event);
        createStatus.should.eql(201), "Event creation status should be 201";
        createBody.id.should.a("string", "Returned id should be string");

        const {status: findStatus, body: findBody} = await eventRequests.showEvent(createBody.id); 
        findStatus.should.eql(200, "Find created event status should be 200"); 
        findBody.name.should.eql(redWeddingEvent.event.name, "Found event name should equal same that was given in creation"); 
        findBody.dates.length.should.eql(redWeddingEvent.event.dates.length, "Found event should have same dates as given in creation"); 

        for(const date of redWeddingEvent.event.dates) {
            findBody.dates.indexOf(date).should.not.eql(-1, "All dates given dates in creation should be contained in found event's dates");
        }

        for(const quest of redWeddingEvent.voters) {
            const {status: voteStatus, body: voteBody} = await eventRequests.voteEvent(createBody.id, quest); 
            voteStatus.should.eql(200, "Vote should be successful"); 
            voteBody.id.should.eql(createBody.id, "Vote response's id should be same as created"); 
            voteBody.votes.should.a("array", "Votes should be an array"); 
            // First check if quest should have voted on date. If should have voted check if vote has been counted. If not voted return true.
            const votesCounted = voteBody.votes.every(eventVote => quest.dates.includes(eventVote.date) ? eventVote.people.includes(quest.name) : true); 
            votesCounted.should.eql(true, "All votes should be counted");
        }

        const {status: resultStatus, body: resultBody} = await eventRequests.resultEvent(createBody.id);
        resultStatus.should.eql(200, "Result status should be 200"); 
        resultBody.id.should.eql(createBody.id, "Result body id should be same as created"); 
        resultBody.name.should.eql(redWeddingEvent.event.name, "Result event name is same as created");
        resultBody.suitableDates.should.a("array"); 
        resultBody.suitableDates.length.should.eql(redWeddingEvent.suitableDates.length, "Suitable dates length should be same in results");

        const peopleArray = redWeddingEvent.voters.map(voter => voter.name); 
        const resultHaveAllThePeople = resultBody.suitableDates.every(date => peopleArray.every(p => date.people.includes(p))); 
        resultHaveAllThePeople.should.eql(true, "All voters should be included in possible dates");

        const addSuitableDatesShouldBeIncluded = redWeddingEvent.suitableDates.every(date => resultBody.suitableDates.findIndex(resultDate => resultDate.date === date) !== -1); 
        addSuitableDatesShouldBeIncluded.should.eql(true, "All suitable dates are included in results");
    }); 
}); 

describe("Events API - create", function() {
    it("Success", async () => {
        const {status, body} = await eventRequests.createEvent(eventTestData.create.success); 
        status.should.eql(201, "Request should be OK");
        Object.keys(body).length.should.eql(1, "Request should only return one item"); 
        body.id.should.a("string", "Response ID should be string");  
    }); 

    it("No name variable", async () => {
        const {status, body} = await eventRequests.createEvent(eventTestData.create.noName); 
        status.should.eql(400); 
    }); 

    it("Empty name string", async () => {
        const {status, body} = await eventRequests.createEvent(eventTestData.create.emptyName); 
        status.should.eql(400);
    }); 

    it("No dates", async () => {
        const {status, body} = await eventRequests.createEvent(eventTestData.create.noDates); 
        status.should.eql(400);
    }); 

    it("Empty dates array", async () => {
        const {status, body} = await eventRequests.createEvent(eventTestData.create.emptyDates); 
        status.should.eql(400);
    }); 

    it("Wrong type in dates", async () => {
        const {status, body} = await eventRequests.createEvent(eventTestData.create.wrongDateType); 
        status.should.eql(400);
    }); 

    it("Two same dates in dates array", async () => {
        const {status, body} = await eventRequests.createEvent(eventTestData.create.twoSameDates); 
        status.should.eql(400);
    }); 

    it("Bad date format", async () => {
        const {status, body} = await eventRequests.createEvent(eventTestData.create.badDate); 
        status.should.eql(400);
    });

    it("Different date format", async () => {
        const {status, body} = await eventRequests.createEvent(eventTestData.create.differentDateFormat); 
        status.should.eql(201);
    }); 
}); 

describe("Events API - show", function() {

}); 

describe("Events API - vote", function() {

}); 

describe("Events API - result", function() {

});

describe("Events API - list", function() {

}); 

after(async function() {
    let connection = getConnection(); 
    let client = getClient(); 

    if(process.env.ENV === "dev" && process.env.TEST_ENV_DROP_DB_AFTER_TEST === "true") {
        const dropRes = await connection.dropDatabase(); 
        console.log(dropRes ? "Test database dropped successfully" : "Couldn't drop test database");
    }

    client.close();
});