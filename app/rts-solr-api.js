/* global module,require*/

// Solr Client
var solr = require("solr-client");
var client = null;
var logger = null;

/**
 *
 */
function getJournalEntries() {
    var query = client.createQuery()
        .q({type: "journalEntry"})
        .start(0)
        .rows(100);
    client.search(query, function(err, obj) {
        if(err) {
            logger.info(err);
        } else {
            logger.error(obj);
        }
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

module.exports = function(config, log) {
    logger = log;

    client = solr.createClient(config);

    return {
        version: "1.0",
        dbType: "Apache Solr",
        addJournalEntry: addJournalEntry,
        getJournalEntries: getJournalEntries
    };
};
