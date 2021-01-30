exports.isValidDate = function (dateString) {
    let date = new Date(dateString); 

    return date instanceof Date && !isNaN(date);
}

exports.replaceMongoIdProperty = function(mongoObject) {
    if(!mongoObject.hasOwnProperty("_id")) {
        throw new Error("Given object doesn't have _id property"); 
    }

    if(mongoObject.hasOwnProperty("id")) {
        throw new Error("Given object already has id property");
    }

    let id = mongoObject._id; 
    delete mongoObject._id; 
    mongoObject.id = id; 
    return mongoObject; 
}