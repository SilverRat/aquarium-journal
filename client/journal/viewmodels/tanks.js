// Manage Tanks.  Gallons, Dimensions

/* eslint no-console: "off" */
define(["plugins/http", "durandal/app"], function(http, app) {
    var vm = {
        displayName: "Tanks",
        newEntry: {},
        entries: [],

        activate: function() {
            this.newEntry = this.createTankEntry();
            this.fetchTankEntries();
        },

        createTankEntry: function() {
            return {
                id: "",
                tankName: "", // Friendly name to id tanks
                tankVolume: "", // in gallons
                tankHeight: "", // in inches
                tankWidth: "", // in inches
                tankDepth: "", // in inches
                entryDateTime: new Date()
            };
        },

        fetchTankEntries: function() {
            var self=this;
            http.get(location.href.replace(/[^/]*$/, "") + "tanks").then(function(data){
                self.entries.push.apply(self.entries, data);
            },function(err){
                // do error stuff
            });    
        }
    };

    vm.addTankEntry = function() {
        this.entries.push(this.newEntry); 

        const self = this;
        http.post(location.href.replace(/[^/]*$/, "") + "tank", this.newEntry).then(function(entry) {
            self.newEntry.id = entry.id;
            self.newEntry = self.createTankEntry();
        }, function() {
            // do error stuff
        });
    }.bind(vm);

    vm.deleteTankEntry = function(entry) {
        var self=this;
        // http://durandaljs.com/documentation/api.html#module/http/method/remove
        http.remove(location.href.replace(/[^/]*$/, "") + "tank/" + entry.id).then(function(){
            //ToDo: remove the entry from the entries array, or just re-load the array?
            self.entries.splice(self.entries.indexOf(entry),1);
        },function(err){
            // do error stuff
        });    
    }.bind(vm);

    // edit will stage the data for editing, a subsequent save will call update, or cancel will exit editing.
    // UNEXPECTED BEHAVIOR.  This appears to pass in the data in the "entry" field that are data bound for that element, 
    //  NOT the full record.  Since the new record type is NOT bound, it gets lost in the update and can no longer be
    //  queried with the record type filter. I think I could look it up in the array, but it would probably be lost again in
    //  the detail view.  SO, since this is an implemenation detail of the schema, I'm ensuring the record type is always set 
    //  correctly in the REST interface.
    vm.editTankEntry = function(entry) {
        this.newEntry = entry;
    }.bind(vm);

    vm.cancelUpdate = function() {
        this.newEntry = this.createTankEntry();
    }.bind(vm);

    vm.onClickTankSelection = function(entry) {
        this.newEntry.tank = entry;
    }.bind(vm);

    vm.updateTankEntry = function(entry) {
        var self=this;
        http.put(location.href.replace(/[^/]*$/, "") + "tank/" + this.newEntry.id, this.newEntry).then(function(){
            self.newEntry = self.createTankEntry();
        },function(err){
            // do error stuff
            console.log(err);
            self.entries.length = 0;
            self.fetchTankEntries();
        });    
    }.bind(vm);

    return vm;

});
