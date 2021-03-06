// Record water adjustments - Ph Up, Ph Down, dechlorinator, salt, copper, misc.

// New idea - add data by event types. 
//   IE:    check water chemistry (ph, nh3, ammonia, nitrite, nitrate, gh, kh, o2, water temp, turbidity)
//          water change (gallons, new water PH, new water temp)
//          clean filter (date, notes)
//          add chemicals (ph Up, ph Down, dechlorinator, salt, copper)

/* eslint no-console: "off" */
define(["plugins/http", "durandal/app"], function(http, app) {
    var vm = {
        displayName: "Water Adjustment",
        newEntry: {},
        entries: [],
        tanks: [],

        activate: function() {
            this.newEntry = this.createJournalEntry();
            this.fetchJournalEntries();
            this.fetchTankEntries();
        },

        createWaterAdjustment: function() {
            return {
                id: "",
                ph: "",             // 0.0,
                freeAmmonia: "",    // 0.0,
                totalAmmonia: "",   // 0.0,
                nitrite: "",        // 0.0,
                nitrate: "",        // 0.0,
                o2: "",             // 0,
                gh: "",             // 0,
                kh: "",             // 0,
                waterTemp: "",      //0.0,
                turbidity: "",
                tank: "",
                entryDateTime: new Date()
            };
        },

        fetchWaterAdjustments: function() {
            var self=this;
            http.get(location.href.replace(/[^/]*$/, "") + "journalEntries").then(function(data){
                self.entries.push.apply(self.entries, data);
            },function(err){
                // do error stuff
            });    
        },

        fetchTankEntries: function() {
            var self=this;
            http.get(location.href.replace(/[^/]*$/, "") + "tanks").then(function(data){
                var tankNames = data.map(function(t) {
                    return t.name;
                });
                self.tanks.push.apply(self.tanks, tankNames);
            },function(err){
                // do error stuff
            });    
        }
    };

    vm.addWaterAdjustment = function() {
        this.entries.push(this.newEntry); 

        var self = this;
        http.post(location.href.replace(/[^/]*$/, "") + "waterAdjustment", this.newEntry).then(function(entry) {
            self.newEntry.id = entry.id;
            self.newEntry = self.createWaterAdjustment();
        }, function() {
            // do error stuff
        });
    }.bind(vm);

    vm.deleteWaterAdjustment = function(entry) {
        var self=this;
        // http://durandaljs.com/documentation/api.html#module/http/method/remove
        http.remove(location.href.replace(/[^/]*$/, "") + "waterAdjustment", { id: entry.id }).then(function(){
            //ToDo: remove the entry from the entries array, or just re-load the array?
            self.entries.splice(self.entries.indexOf(entry),1);
        },function(err){
            // do error stuff
        });    
    }.bind(vm);

    // edit will stage the data for editing, a subsequent save will call update, or cancel will exit editing.
    vm.editWaterAdjustment = function(entry) {
        this.newEntry = entry;
    }.bind(vm);

    vm.cancelUpdate = function() {
        this.newEntry = this.createJournalEntry();
    }.bind(vm);

    vm.updateWaterAdjustment = function(entry) {
        var self=this;
        http.put(location.href.replace(/[^/]*$/, "") + "waterAdjustment", this.newEntry).then(function(){
            self.newEntry = self.createJournalEntry();
        },function(err){
            // do error stuff
            console.log(err);
            self.entries.length = 0;
            self.fetchJournalEntries();
        });    
    }.bind(vm);

    return vm;

});
