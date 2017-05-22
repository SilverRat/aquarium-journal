/* global module,require*/

// Solr Client
var solr = require("solr-client");
var client = null;
var logger = null;

/**
 *
 */
function getJournalEntries() {
    return new Promise(function(fulfill, reject){
        var query = client.createQuery()
            .q("*:*")
            //.q({type: "journalEntries"})
            .start(0)
            .rows(100);
        client.search(query, function(err, obj) {
            if(err) {
                logger.error(err);
                reject(err);
            } else {
                logger.info(obj);            
                fulfill (obj);
            }
        });        
    });
}
/**
 * Insert new request into database.
 * @param {Request} newRequest
 */
function addJournalEntry(newEntry) {
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
    updateEntry._version_ = 0;
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
