let app; 
let eventRequests; 

const chai = require("chai"); 
const chaiHttp = require("chai-http"); 
chai.should(); 
chai.use(chaiHttp); 

const { getClient, getConnection } = require("../../../../mongodb/eventsConnection");

const {v1Path, eventPath} = require("../../../../routes/api/v1/constants"); 
const URL = v1Path + eventPath;


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

describe("Events API - " + URL, function() {
    it("/list empty events", async () => {
        const {status, body} = await eventRequests.listEvents();
        status.should.eql(200);
        body.events.should.a("array");
       // body.events.length.should.eql(0);
    }); 

    it("Test create and find after it", async () => {
        const reqBody = {
            name: "Test event",
            dates: ["2020-1-1", "2021-1-1"]
        }; 
    
        const {status, body} = await eventRequests.createEvent(reqBody);
        status.should.eql(201);

    }); 
})

after(async function() {
    let connection = getConnection(); 
    let client = getClient(); 

    if(process.env.ENV === "dev" && process.env.TEST_ENV_DROP_DB_AFTER_TEST === "true") {
        const dropRes = await connection.dropDatabase(); 
        console.log(dropRes ? "Test database dropped successfully" : "Couldn't drop test database");
    }

    client.close();
    process.exit(); 
});