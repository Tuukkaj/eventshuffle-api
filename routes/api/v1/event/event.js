const router = require("express").Router(); 
const { ObjectId } = require("mongodb");
const {eventPath} = require("../constants"); 
const { isValidDate, replaceMongoIdProperty, unifyDateString } = require("../helpers");
const db = require("../../../../mongodb/eventsConnection").getConnection();
const events = db.collection(process.env.MONGO_DB_EVENTS_COLLECTION);
const log = new (require("../../../../logger/Logger"))("event.js"); 


router.get(`${eventPath}/list`, async function list(req, res) {
    try {
        let list = await events.find().toArray(); 

        if(list) {
            list = list.map(item => ({id: ObjectId(item._id), name: item.name})); 
            return res.json({events: list}); 
        }

        return res.status(500).send(req.loc.api.event_listing_failed); 

    } catch(err) {
        log.error("list", "Error listing events");
        log.error("list", err); 
        return res.status(500).send(req.loc.api.event_listing_failed); 
    }
}); 

router.post(`${eventPath}`, async function add(req, res) {
    const name = req.body.name; 
    const dates = req.body.dates; 

    if(typeof name !== "string" || name.length < 1) {
        return res.status(400).send(req.loc.api.event_create_missing_name);
    }

    if(!Array.isArray(dates) || dates.length < 1 
    || dates.some((d, i) => dates.indexOf(d) !== i) || dates.some(d => !isValidDate(d))) {
        return res.status(400).send(req.loc.api.event_create_missing_dates);
    }

    const transformedDates = dates.map(unifyDateString); 

    try {
        const created = await events.insertOne({name, dates: transformedDates});

        if(created) {
            return res.status(201).json({id: ObjectId(created.ops[0]._id)}); 
        }

        return res.status(500).send(req.loc.api.event_creation_failed); 

    } catch(err) {
        log.error("add", "Error creating new event");
        log.error("add", err); 
        return res.status(500).send(req.loc.api.event_creation_failed); 
    }
}); 


router.get(`${eventPath}/:eventId`, async function show(req, res) {
    const { eventId } = req.params; 

    if(!ObjectId.isValid(eventId)) {
        return res.status(400).send(req.loc.api.event_not_valid_event_id);
    }

    try {
        const found = await events.findOne({_id: ObjectId(eventId)});

        if(found) {
            let id = found._id; 
            delete found._id; 
            return res.json({id, ...found});
        }

        return res.status(404).send(req.loc.api.event_find_failed_with_given_id.replace("<id>", eventId)); 

    } catch(err) {
        log.error("show", "Error finding event");
        log.error("show", err); 
        return res.status(500).send(req.loc.api.event_find_failed); 
    }

}); 

router.post(`${eventPath}/:eventId/vote`, async function vote(req, res) {
    const { eventId } = req.params; 
    const name = req.body.name; 
    const dates = req.body.dates; 

    if(typeof name !== "string" || name.length < 1) {
        return res.status(404).send(req.loc.api.event_name_must_be_string); 
    }

    if(!ObjectId.isValid(eventId)) {
        return res.status(400).send(req.loc.api.event_not_valid_event_id);
    }

    if(!Array.isArray(dates) || !dates.every(isValidDate)) {
        return res.status(404).send(req.loc.api.event_date_must_be_date_arr);
    }

    if(new Set(dates).size !== dates.length) {
        return res.status(404).send(req.loc.api.event_vote_dates_must_be_unique);
    }

    try {
        const eventObjectId = ObjectId(eventId); 
        const found = await events.findOne({_id: eventObjectId});

        if(!found) {
            return res.status(404).send(req.loc.api.event_find_failed_with_given_id.replace("<id>", eventId)); 
        }

        let votes = Array.isArray(found.votes) ? found.votes : []; 

        const people = [...new Set((votes.map(vote => vote.people).flat()))];

        if(people.includes(name)) {
            return res.status(404).send(req.loc.api.event_name_already_voted.replace("<name>", name)); 
        }

        for(let eventDate of dates) {
            const unifiedDateString = unifyDateString(eventDate); 

            if(found.dates.includes(unifiedDateString)) {
                const voteIndex = votes.findIndex(voteDate => voteDate.date === unifiedDateString); 

                if(voteIndex !== -1) {
                    votes[voteIndex].people.push(name); 
                } else {
                    votes.push({
                        date: unifiedDateString,
                        people: [name]
                    })
                }
            } else {
                return res.status(404).send(req.loc.api.event_vote_date_not_in_event + ": " + unifiedDateString);
            }
        }

        found.votes = votes; 
        const updated = await events.findOneAndReplace({_id: eventObjectId}, found, {returnOriginal: false}); 

        return res.json(replaceMongoIdProperty(updated.value));
        
    } catch(err) {
        log.error("vote", "Error voting event");
        log.error("vote", err); 
        return res.status(500).send(req.loc.api.event_find_failed); 
    }
}); 

router.get(`${eventPath}/:eventId/results`, async function results(req, res) {
    const { eventId } = req.params; 

    if(!ObjectId.isValid(eventId)) {
        return res.status(400).send(req.loc.api.event_not_valid_event_id);
    }

    try {
        const found = await events.findOne({_id: ObjectId(eventId)});
        
        if(!Array.isArray(found.votes) || found.votes.length < 1) {
            return res.status(204).send(req.loc.api.event_result_not_voted); 
        }

        const people = [...new Set((found.votes.map(vote => vote.people).flat()))];

        const suitableDates = found.votes.filter(vote => vote.people.length === people.length); 

        return res.json({id: ObjectId(found._id), name: found.name, suitableDates}); 
        
    } catch(err) {
        log.error("results", "Error voting event event");
        log.error("results", err); 
        return res.status(500).send(req.loc.api.event_result_failed); 
    }
}); 

module.exports = router; 