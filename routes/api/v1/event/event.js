const router = require("express").Router(); 
const {eventPath} = require("../constants"); 

router.get(`${eventPath}/list`, function(req, res) {
    res.send("/list");
}); 

router.post(`${eventPath}`, function(req, res) {
    res.send("/create");
}); 

router.get(`${eventPath}/:eventId`, function(req, res) {
    res.send("/show event");
}); 

router.post(`${eventPath}/:eventId/vote`, function(req, res) {
    res.send("/vote");
}); 

router.get(`${eventPath}/:eventId/results`, function(req, res) {
    res.send("/results");
}); 

module.exports = router; 