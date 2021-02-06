let app; 
let eventRequests; 

const { ObjectId } = require("mongodb");

const chai = require("chai"); 
const chaiHttp = require("chai-http"); 
chai.should(); 
chai.use(chaiHttp); 

const { getClient, getConnection } = require("../../../../mongodb/eventsConnection");

const {v1Path, eventPath} = require("../../../../routes/api/v1/constants"); 
const eventTestData = require("./eventTestData");
const URL = v1Path + eventPath;

const testData = require("./eventTestData");
const eventsConnection = require("../../../../mongodb/eventsConnection");
const { assert } = require("chai");
const { unifyDateString } = require("../../../../routes/api/v1/helpers");

// Before all tests are run 
before(function(done) {
    // Run after main application has started
    const onAppLoaded = startedApp => {
        app = startedApp;
        eventRequests = new (require("./EventsRequests"))(app, URL);
        done();
    }

    const d = new Date(); 
    const dateString = `${d.getUTCFullYear()}_${d.getUTCMonth()}_${d.getUTCDate()}__${d.getUTCHours()}_${d.getUTCMinutes()}_${d.getUTCSeconds()}_${d.getUTCMilliseconds()}`;

    // Start application and give test database name
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

    // Tests whole case. Create, find, vote and show.
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
            const transformedDate = unifyDateString(date);
            findBody.dates.indexOf(transformedDate).should.not.eql(-1, "All dates given dates in creation should be contained in found event's dates");
        }

        for(const quest of redWeddingEvent.voters) {
            const {status: voteStatus, body: voteBody} = await eventRequests.voteEvent(createBody.id, quest); 
            voteStatus.should.eql(200, "Vote should be successful"); 
            voteBody.id.should.eql(createBody.id, "Vote response's id should be same as created"); 
            voteBody.votes.should.a("array", "Votes should be an array"); 
            // First check if quest should have voted on date. If should have voted check if vote has been counted. If not voted return true.
            const questTransformedDates = quest.dates.map(unifyDateString);
            const votesCounted = voteBody.votes.every(eventVote => questTransformedDates.includes(eventVote.date) ? eventVote.people.includes(quest.name) : true); 
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

        const addSuitableDatesShouldBeIncluded = redWeddingEvent.suitableDates.every(date => resultBody.suitableDates.findIndex(resultDate => resultDate.date === unifyDateString(date)) !== -1); 
        addSuitableDatesShouldBeIncluded.should.eql(true, "All suitable dates are included in results");
    }); 
}); 

// Tests creation of event 
describe("Events API - create", function() {
    it("Success", async () => {
        const {status, body} = await eventRequests.createEvent(eventTestData.create.success); 
        status.should.eql(201, "Request should be OK");
        Object.keys(body).length.should.eql(1, "Request should only return one item"); 
        body.id.should.a("string", "Response ID should be string");  
    }); 

    it("No name variable", async () => {
        const {status, body} = await eventRequests.createEvent(eventTestData.create.noName); 
        status.should.eql(400, "No name should result in error"); 
    }); 

    it("Empty name string", async () => {
        const {status, body} = await eventRequests.createEvent(eventTestData.create.emptyName); 
        status.should.eql(400, "Empty name should result in error");
    }); 

    it("No dates", async () => {
        const {status, body} = await eventRequests.createEvent(eventTestData.create.noDates); 
        status.should.eql(400, "No dates in request should result in error");
    }); 

    it("Empty dates array", async () => {
        const {status, body} = await eventRequests.createEvent(eventTestData.create.emptyDates); 
        status.should.eql(400, "Empty dates array should result in error");
    }); 

    it("Wrong type in dates", async () => {
        const {status, body} = await eventRequests.createEvent(eventTestData.create.wrongDateType); 
        status.should.eql(400, "Wrong type in dates should result in error");
    }); 

    it("Two same dates in dates array", async () => {
        const {status, body} = await eventRequests.createEvent(eventTestData.create.twoSameDates); 
        status.should.eql(400, "Two same dates should result in error");
    }); 

    it("Bad date format", async () => {
        const {status, body} = await eventRequests.createEvent(eventTestData.create.badDate); 
        status.should.eql(400, "Bad date format should result in error");
    });

    it("Different date format", async () => {
        const {status, body} = await eventRequests.createEvent(eventTestData.create.differentDateFormat); 
        status.should.eql(201, "Different date formats should be accepted");
    }); 
}); 

// Tests showing of event
describe("Events API - show", function() {
    let eventId; 
    const testItem = eventTestData.show.initialItem; 

    // Creates test item to database
    before(async function() {
        const connection = getConnection().collection(process.env.MONGO_DB_EVENTS_COLLECTION); 
        const created = await connection.insertOne(testItem);

        eventId =  created.ops[0]._id;
    });

    // Test that successful use case scenario works
    it("success", async () => { 
        const {status, body} = await eventRequests.showEvent(eventId); 

        status.should.eql(200, "Show result be success");
        body.name.should.eql(testItem.name, "Fetched event's name should be same as given"); 
        body.id.should.eql(eventId.toString(), "Event IDs should match"); 
        body.dates.length.should.eql(testItem.dates.length, "Dates array should have same length"); 

        const areDatesSame = testItem.dates.every(d => body.dates.includes(d)); 
        assert(areDatesSame, true, "Dates should be same"); 
        
        const areVotesSame = testItem.votes.every(vote => {
            return testItem.votes.some(testVote => {
                return testVote.date === vote.date && 
                    testVote.people.length === vote.people.length && 
                    testVote.people.every(p => vote.people.includes(p)); 
            });
        });

        assert(areVotesSame, true, "Votes should be same");
    }); 

    it("Bad event ID", async () => {
        const {status, body} = await eventRequests.showEvent("THIS IS NOT AN EVENT ID"); 

        status.should.eql(400, "Bad ID should result in error"); 
    }); 
}); 

// Tests voting of event
describe("Events API - vote", function() {
    let eventId; 
    const { initialItem } = eventTestData.vote;

    // Create test item to database
    before(async function() {
        const connection = getConnection().collection(process.env.MONGO_DB_EVENTS_COLLECTION); 
        const created = await connection.insertOne(initialItem);

        eventId = created.ops[0]._id;
    });

    // Tests successful voting scenario
    it("Success", async () => {
        const { successVote } = eventTestData.vote;
        const {status, body} = await eventRequests.voteEvent(eventId, successVote);
        status.should.eql(200, "Voting should be success");

        body.name.should.eql(initialItem.name, "Returned name should be same");
        body.dates.length.should.eql(initialItem.dates.length, "Returned dates length should be same");
        body.votes.should.a("array", "Votes should be array");
        body.votes.length.should.eql(successVote.dates.length, "Votes length should be same");

        for(const vote of body.votes) {
            successVote.dates.includes(vote.date).should.eql(true, "Voted date should be included in votes dates");
            vote.people.includes(successVote.name).should.eql(true, "Voter's name should be in response");
        }
    });

    it("Try to vote with same name two times", async () => {
        const { voteTwiceName } = eventTestData.vote;
        const { status, body } = await eventRequests.voteEvent(eventId, voteTwiceName);
        status.should.eql(200, "First vote should result in OK");
        const { status: secondStatus, body: secondBody } = await eventRequests.voteEvent(eventId, voteTwiceName);
        secondStatus.should.eql(404, "Second vote should result in failure");
    });

    it("No name", async () => {
        const { noName } = eventTestData.vote;
        const { status, body } = await eventRequests.voteEvent(eventId, noName);
        status.should.eql(404, "Vote without name should result in failure");
    }); 

    it("No dates", async () => {
        const { noDate } = eventTestData.vote;
        const { status, body } = await eventRequests.voteEvent(eventId, noDate);
        status.should.eql(404, "Vote without dates should result in failure");
    }); 

    it("Date that isn't in event", async () => {
        const { voteDateNotInEvent } = eventTestData.vote;
        const { status, body } = await eventRequests.voteEvent(eventId, voteDateNotInEvent);
        status.should.eql(404, "Vote with wrong dates should result in failure");
    });

    it("Two same dates in vote", async () => {
        const { twoSameDates } = eventTestData.vote;
        const { status, body } = await eventRequests.voteEvent(eventId, twoSameDates);
        status.should.eql(404, "Two same dates should result in failure");
    });
}); 

// Tests showing of results in event
describe("Events API - result", function() {
    let successEventId, noVotesId; 
    const {success, successSuitableDates, noVotes} = eventTestData.result; 

    // Init test items to database
    before(async function() {
        const connection = getConnection().collection(process.env.MONGO_DB_EVENTS_COLLECTION); 

        const successCreated = await connection.insertOne(success);
        successEventId = successCreated.ops[0]._id;

        const noVotesCreated = await connection.insertOne(noVotes); 
        noVotesId = noVotesCreated.ops[0]._id;
    }); 

    // Successful use case scenario
    it("Success", async () => {
        const {status, body} = await eventRequests.resultEvent(successEventId);
        status.should.eql(200, "Showing results should result in OK");
        body.name.should.eql(success.name, "Returned name should equal created item's");
        body.suitableDates.length.should.eql(successSuitableDates.length, "Suitable dates lengths should be same");
        
        body.suitableDates.every(d => successSuitableDates.includes(d.date)).should.eql(true, "All suitable dates should be included in response");
    });

    it("No votes", async () => {
        const {status, body} = await eventRequests.resultEvent(noVotesId);
        status.should.eql(204, "Showing results in event that has no votes should result in 204");
    });

    it("Bad event ID", async () => {
        const {status, body} = await eventRequests.showEvent("THIS IS NOT AN EVENT ID"); 

        status.should.eql(400, "Giving bad ID should result in failure"); 
    }); 
});

describe("Events API - list", function() {
    let events; 

    // Fetches all of the events from database
    before(async function () {
        const connection = getConnection().collection(process.env.MONGO_DB_EVENTS_COLLECTION); 
        events = await connection.find({}).toArray(); 
    }); 
    
    it("All events are listed", async () => {
        const {status, body} = await eventRequests.listEvents();
        body.events.length.should.eql(events.length, "Returned event list should have same length");
        
        for(const e of events) {
            body.events.some(bodyEvent => {
                return bodyEvent.name === e.name && bodyEvent.id === e._id.toString();
            }).should.eql(true, "All events should be listed");
        }
    });
}); 

// Closes connection to test database. Also drobs test database if configured in .env
after(async function() {
    let connection = getConnection(); 
    let client = getClient(); 

    if(process.env.NODE_ENV === "development" && process.env.TEST_ENV_DROP_DB_AFTER_TEST === "true") {
        const dropRes = await connection.dropDatabase(); 
        console.log(dropRes ? "Test database dropped successfully" : "Couldn't drop test database");
    }

    client.close();
});