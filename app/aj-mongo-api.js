var mongoClient = require("mongodb").MongoClient;
var logger = null;
var config = null;

function getJournalEntries() {
    return new Promise(function(fulfill, reject){

        mongoClient.connect(config.url, function(err,db) {
            // Get the documents collection
            var collection = db.collection('journalEntries');
            // Find some documents
            collection.find({}).toArray(function(err, docs) {
                if (err) {
                    logger.error(err);
                    db.close();
                    reject(err);
                } else {                
                    logger.info("Found the following records", docs);
                    db.close();
                    fulfill(docs);
                }
            });
        });
    });
}

function addJournalEntry(newEntry) {
    mongoClient.connect(config.url, function(err,db) {
        // Get the documents collection
        var collection = db.collection('journalEntries');

        collection.insertMany([
            newEntry
        ], function(err, result) {
            if (err) {
                logger.error(err);
                db.close();
            } else {    
                logger.info("Inserted document into the collection");
                db.close();
            }
        });
    });
}

function deleteJournalEntry(id){
    mongoClient.connect(config.url, function(err,db) {

        var collection = db.collection('journalEntries');
        // Delete document by id
        collection.deleteOne({ id : id }, function(err, result) {
            if (err) {
                logger.error(err);
                db.close();
            } else {            
                logger.info("Removed the document with id of : " + id); 
                db.close;
            }
        });    
    });
}

function updateJournalEntry(updateEntry) {
    mongoClient.connect(config.url, function(err,db) {

        var collection = db.collection('journalEntries');
        // Delete document by id
        delete updateEntry._id; // remove the mongo document ID because of some bson BS.
        collection.updateOne({ id : updateEntry.id }, updateEntry, function(err, result) {
            if (err) {
                logger.error(err);
                db.close();
            } else {            
                logger.info("Updated document with the id of : " + updateEntry.id);
                db.close;
            }
        });    
    });

}

module.exports = function(cfg, log) {
    logger = log;

    config = cfg;

    return {
        version: "1.0",
        dbType: "Mongo",
        addJournalEntry: addJournalEntry,
        getJournalEntries: getJournalEntries,
        deleteJournalEntry: deleteJournalEntry,
        updateJournalEntry: updateJournalEntry
    };
};
