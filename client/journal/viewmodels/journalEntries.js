// Record readings - Ph, Free Ammonia (NH3), Total Ammonia (NH3, NH4), 
//  Nitrite, Nitrate, O2, Water Temp, Water Change (gallons), Water Clarity, Filter Cleaning

// New idea - add data by event types. 
//   IE:    check water chemistry (ph, nh3, ammonia, nitrite, nitrate, gh, kh, o2, water temp, turbidity)
//          water change (gallons, new water PH, new water temp)
//          clean filter (date, notes)
//          add chemicals (ph Up, ph Down, dechlorinator, salt, copper)

/* eslint no-console: "off" */
define(["plugins/http", "durandal/app"], function(http, app) {
    return {
        displayName: "Journal Entries",
        newEntry: {},
        entries: [],

        activate: function() {
            this.newEntry = this.createJournalEntry();
            this.fetchJournalEntries();
        },

        createJournalEntry: function() {
            return {
                ph: "",             // 0.0,
                freeAmmonia: "",    // 0.0,
                totalAmmonia: "",   // 0.0,
                nitrite: "",        // 0.0,
                nitrate: "",        // 0.0,
                o2: "",             // 0,
                gh: "",             // 0,
                kh: "",             // 0,
                waterTemp: "",      //0.0,
                volWaterChange: "",     //0,
                turbidity: "",
                cleanFilter: false,
                entryDateTime: new Date()
            };
        },

        addJournalEntry: function() {
            this.entries.push(this.newEntry); //but this will need an ID to edit.  Maybe reload?

            const self = this;
            http.post(location.href.replace(/[^/]*$/, "") + "journalEntry", this.newEntry).then(function() {
                this.newEntry = this.createJournalEntry();
            }, function() {
                // do error stuff
            });
        }, // .bind(this)

        // edit will stage the data for editing, a subsequent save will call update, or cancel will exit editing.
        editJournalEntry: function(entry) {
            this.newEntry = entry;
            // Todo - add code to hide add button and show update button.  
            //   Or maybe add can do both, depending on whether an ID exists?
        },

        updateJournalEntry: function() {

        },

        deleteJournalEntry: function(entry) {
            var self=this;
            // http://durandaljs.com/documentation/api.html#module/http/method/remove
            http.remove(location.href.replace(/[^/]*$/, "") + "journalEntry", { id: entry.id }).then(function(){
                //remove the entry from the entries array, or just re-load the array?
                self.entries.length = 0;
                self.fetchJournalEntries();
            },function(err){
                // do error stuff
            });    

        },

        fetchJournalEntries: function() {
            var self=this;
            http.get(location.href.replace(/[^/]*$/, "") + "journalEntries").then(function(data){
                self.entries.push.apply(self.entries, data.response.docs);
            },function(err){
                // do error stuff
            });    
        }
    };
});
