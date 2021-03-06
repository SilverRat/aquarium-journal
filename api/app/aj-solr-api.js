/* global module,require*/

// Solr Client
var solr = require("solr-client");
var client = null;
var logger = null;

/**
 *
 */
function getJournalEntries(rt) {
    return new Promise(function(fulfill, reject){
        var query = client.createQuery()
            //.q("*:*")
            .q({recordType: rt})
            .start(0)
            .rows(100);
        client.search(query, function(err, obj) {
            if(err) {
                logger.error(err);
                reject(err);
            } else {
                logger.info(obj);            
                fulfill (obj.response.docs);
            }
        });        
    });
}
/**
 * Insert new request into database.
 * @param {Request} newRequest
 */
function addJournalEntry(newEntry) {
    //newEntry._version = -1;   Check this later.  This should ensure duplicate IDs are not added.
    client.add(newEntry, function(err, obj) {
        if(err) {
            logger.error(err);
        } else {
            logger.info(obj);
            client.softCommit(function(err, res) {
                if(err) {
                    logger.error(err);
                } else {
                    logger.info(res);
                }
            });
        }
    });
}

/**
 * Insert new request into database.
 * @param {Request} newRequest
 */
function updateJournalEntry(updateEntry) {
    updateEntry._version_ = 1; // 0 will add a new object. 1 makes sure the ID exists.
    client.add(updateEntry, function(err, obj) {
        if(err) {
            logger.error(err);
        } else {
            logger.info(obj);
            client.softCommit(function(err, res) {
                if(err) {
                    logger.error(err);
                } else {
                    logger.info(res);
                }
            });
        }
    });
}

/**
 * Delete Journal Entry
 * @param {id} id
 */
function deleteJournalEntry(id) {
    client.deleteByID(id, function(err, obj) {
        if(err) {
            logger.error(err);
        } else {
            logger.info(obj);
            client.softCommit(function(err, res) {
                if(err) {
                    logger.error(err);
                } else {
                    logger.info(res);
                }
            });
        }
    });
}

module.exports = function(config, log) {
    logger = log;

    client = solr.createClient(config);

    return {
        version: "1.0",
        dbType: "Apache Solr",
        addJournalEntry: addJournalEntry,
        getJournalEntries: getJournalEntries,
        deleteJournalEntry: deleteJournalEntry,
        updateJournalEntry: updateJournalEntry
    };
};


