/* global __dirname, require, process */
"use strict";
var winston = require("winston");
var config = require("config");
winston.level = config.get("AJ.log.level");

var express = require("express");
var favicon = require("serve-favicon");
// Not sure I want morgan
// var morgan = require("morgan");
var bodyParser = require("body-parser");
// Not sure I want method-override
var methodOverride = require("method-override");
// Not sure I want errorhandler
var errorHandler = require("errorhandler");
// Not sure I need to npm http?  which http???
var http = require("http");
// Not sure I need to npm path (build in to node?)
var path = require("path");

var app = express();


app.set("port", process.env.PORT || 3000);
app.use(favicon(__dirname + "/client/favicon.ico"));
// app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, "client")));

if("development" === app.get("env")) {
    app.use(errorHandler());
}

var server = http.createServer(app);
var transformer = config.get("AJ.wsTransformer");

server.listen(app.get("port"), function() {
    winston.info("Express server listening on port " + app.get("port"));
});

var ajWsApi = require("./app/aj-ws-api")(winston);
winston.info("AJ WS API Version: " + ajWsApi.version);

var dbApi = config.get("AJ.dbApi");
var dbConfig = config.get("AJ.dbConfig");

// You can create your own API for Cassandra, Mongo, Oracle, etc. Just adhere to the interface.
var ajDbApi = require(dbApi)(dbConfig, winston);
winston.info("AJ DB API Type: " + ajDbApi.dbType);
winston.info("AJ DB API Version: " + ajDbApi.version);

app.post("/request", function(req, res) {
    var request = req.body;
    winston.info("Adding request from: " + req._remoteAddress);
    winston.debug("Request data.", request);
    ajDbApi.addRequest(request);
    ajWsApi.addRequest(request);
    res.end("yes");
});

app.post("/addMeeting", function(req, res) {
    var meeting = req.body;
    winston.info("Adding meeting id: " + meeting.meetingId);
    ajDbApi.addMeeting(meeting);
    res.end("yes");
});

app.post("/startMeeting", function(req, res) {
    var meeting = req.body;
    winston.info("Starting meeeting id: " + meeting.meetingId);
    ajWsApi.startMeeting(meeting);
    res.end("yes");
});

app.post("/refreshWall", function(req, res) {
    var requests = req.body;
    winston.info("Refreshing display wall.");
    ajWsApi.refreshWall(requests);
    res.end("yes");
});

app.get("/meeting", function() {

});
