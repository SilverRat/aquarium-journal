/* global __dirname, require, process */
"use strict";
var winston = require("winston");
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
    winston.info("Adding journal entry from: " + req._remoteAddress);
    winston.debug("Request data.", newEntry);
    ajDbApi.addJournalEntry(newEntry);
    res.end("yes");
});

app.post("/addMeeting", function(req, res) {
    var meeting = req.body;
    winston.info("Adding meeting id: " + meeting.meetingId);
    res.end("yes");
});

app.post("/startMeeting", function(req, res) {
    var meeting = req.body;
    winston.info("Starting meeeting id: " + meeting.meetingId);
    res.end("yes");
});

app.post("/refreshWall", function(req, res) {
    var requests = req.body;
    winston.info("Refreshing display wall.");
    res.end("yes");
});

app.get("/meeting", function() {

});
