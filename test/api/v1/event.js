let app; 

const chai = require("chai"); 
const chaiHttp = require("chai-http"); 
chai.should(); 
chai.use(chaiHttp); 

const {v1Path, eventPath} = require("../../../routes/api/v1/constants"); 
const URL = v1Path + eventPath;

before(function(done) {
    require("../../../app")(startedApp => {
        app = startedApp;
        done();
    })
}); 

describe("Events API - " + URL, function() {
    it("Test setup", done => {
        done()
    }); 
})
