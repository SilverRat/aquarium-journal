/* global __dirname, require, process */
"use strict";
var winston = require("winston");
const uuidV4 = require('uuid/v4');
var config = require("config");
winston.level = config.get("AJ.log.level");

var express = require("express");
var favicon = require("serve-favicon");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var http = require("http");
var path = require("path");

var app = express();

app.set("port", process.env.PORT || 3000);
app.use(favicon(__dirname + "/client/favicon.ico"));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "client")));

var server = http.createServer(app);
var transformer = config.get("AJ.wsTransformer");

server.listen(app.get("port"), function() {
    winston.info("Express server listening on port " + app.get("port"));
});

var dbApi = config.get("AJ.dbApi");
var dbConfig = config.get("AJ.dbConfig");

// You can create your own API for Cassandra, Mongo, Oracle, etc. Just adhere to the interface.
var ajDbApi = require(dbApi)(dbConfig, winston);
winston.info("AJ DB API Type: " + ajDbApi.dbType);
winston.info("AJ DB API Version: " + ajDbApi.version);

app.post("/journalEntry", function(req, res) {
    var newEntry = req.body;
    newEntry.id = uuidV4();
    winston.info("Adding journal entry from: " + req._remoteAddress);
    winston.debug("Request data.", newEntry);
    ajDbApi.addJournalEntry(newEntry);
    res.send(newEntry);
});

app.delete("/journalEntry", function(req, res) {
    var id = req.body;
    winston.info("Deleting journal entry id: " + id.id);
    ajDbApi.deleteJournalEntry(id.id);
    res.end("yes");
});

app.put("/journalEntry", function(req, res) {
    var updateEntry = req.body;
    // Update the values to use the set command to support updating.
    // var doc = [{"id":req.body.id,"read":{"set":req.body.read}}];
    winston.info("Updating journal entry from: " + req._remoteAddress);
    winston.debug("Request data.", updateEntry);
    ajDbApi.updateJournalEntry(updateEntry);
    res.status(204).end(); 
});

app.get("/journalEntries", function(req, res) {
    winston.info("Querying for journal entries.");
    ajDbApi.getJournalEntries().then(function(docs){
        winston.info("Winston - Getting journal entries:", docs);
        res.send(docs);
    },function(err){
        winston.error(err);
        res.status(500).send(err);
    });
});
