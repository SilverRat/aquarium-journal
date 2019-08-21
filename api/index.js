/* global __dirname, require, process */
"use strict";
var winston = require("winston");
const uuidV4 = require('uuid/v4');
var config = require("config");
winston.level = config.get("AJ.log.level");

var express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var http = require("http");
var path = require("path");
const cors = require('cors');
//var dataValidation = require("./dataValidation/dataValidation.js");
var routes = ["/journalEntry","/tank"];
var idRoutes = ["/journalEntry/:id","/tank/:id"];

// TODO: implement passport authentication with facebook, google auth, etc.

var app = express();

app.set("port", process.env.PORT || 3000);
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "client")));

app.use(cors());

var server = http.createServer(app);

server.listen(app.get("port"), function() {
    winston.info("Express server listening on port " + app.get("port"));
});

var dbApi = config.get("AJ.dbApi");
var dbConfig = config.get("AJ.dbConfig");

// You can create your own API for Cassandra, Mongo, Oracle, etc. Just adhere to the interface.
var ajDbApi = require(dbApi)(dbConfig, winston);
winston.info("AJ DB API Type: " + ajDbApi.dbType);
winston.info("AJ DB API Version: " + ajDbApi.version);

// Generic data wrappers to the abstracted DB api.
var postData = function(req, res) {
    var newEntry = req.body;
    var eventType = req.path.replace("/","");  //This will tie the envent type of the record to the URL route/path!!!
    newEntry.id = uuidV4();
    newEntry.recordType = eventType;
    winston.info("Adding" + eventType + " entry from: " + req._remoteAddress);
    winston.info("Request data.", newEntry);
    ajDbApi.addJournalEntry(newEntry);
    res.send(newEntry);
};

var deleteData = function(req, res) {
    var id = req.params.id;
    winston.info("Deleting " + req.path);
    ajDbApi.deleteJournalEntry(id);
    res.status(204).end();
};

var updateData = function(req, res) {
    var updateEntry = req.body;
    updateEntry.id = req.params.id;
    //ensure the record type is not lost on updates.
    winston.debug(req.route);
    var route = req.path.replace("/" + req.params.id, "");
    updateEntry.recordType = route.slice(1);
    // Update the values to use the set command to support updating.
    // var doc = [{"id":req.body.id,"read":{"set":req.body.read}}];
    winston.info("Updating " + updateEntry.recordType + " from: " + req._remoteAddress);
    winston.info("Request data.", updateEntry);
    ajDbApi.updateJournalEntry(updateEntry);
    res.status(204).end();
};

//Generic route handling for post,delete,put.
app.post(routes, postData);
app.delete(idRoutes, deleteData);
app.put(idRoutes, updateData);


// Get calls are still specific to the record type because I haven't created a
//  Filter object or decided to tie the gets to limit the get to only filter on
//  record types.

//Journal Entries - Water Chemistry tests.
app.get("/journalEntries", function(req, res) {
    winston.info("Querying for journal entries.");
    ajDbApi.getJournalEntries("journalEntry").then(function(docs){
        winston.info("Winston - Getting journal entries:", docs);
        res.send(docs);
    },function(err){
        winston.error(err);
        res.status(500).send(err);
    });
});

// Tanks
app.get("/tanks", function(req, res) {
    winston.info("Querying for tank entries.");
    ajDbApi.getJournalEntries("tank").then(function(docs){
        winston.info("Winston - Getting tank entries:", docs);
        res.send(docs);
    },function(err){
        winston.error(err);
        res.status(500).send(err);
    });
});
