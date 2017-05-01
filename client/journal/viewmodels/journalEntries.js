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
        },

        createJournalEntry: function() {
            return {
                ph: "",             // 0.0,
                freeAmmonia: "",    // 0.0,
                totalAmmonia: "",   // 0.0,
                nitrite: "",        // 0.0,
                nitrate: "",        // 0.0,
                o2: "",             // 0,
                waterTemp: "",      //0.0,
                waterChange: "",     //0,
                waterClarity: "",
                cleanFilter: false,
                entryDateTime: new Date()
            };
        },

        addJournalEntry: function() {
            this.entries.push(this.newEntry);
            this.newEntry = this.createJournalEntry();
        } // .bind(this)
    };
});
