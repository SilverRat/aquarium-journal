// Record readings - Ph, Free Ammonia (NH3), Total Ammonia (NH3, NH4), 
//  Nitrite, Nitrate, O2, Water Temp, Water Change (gallons), Water Clarity, Filter Cleaning
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
            this.entries.push(this.newEntry);

            const self = this;
            http.post(location.href.replace(/[^/]*$/, "") + "journalEntry", this.newEntry).then(function() {
                this.newEntry = this.createJournalEntry();
            }, function() {
                // do error stuff
            });
        }, // .bind(this)

        updateJournalEntry: function() {

        },

        deleteJournalEntry: function() {

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
