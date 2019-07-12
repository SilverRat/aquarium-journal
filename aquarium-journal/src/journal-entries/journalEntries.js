// Record readings - Ph, Free Ammonia (NH3), Total Ammonia (NH3, NH4),
//  Nitrite, Nitrate, O2, Water Temp, Water Change (gallons), Water Clarity, Filter Cleaning

// New idea - add data by event types.
//   IE:    check water chemistry (ph, nh3, ammonia, nitrite, nitrate, gh, kh, o2, water temp, turbidity)
//          water change (gallons, new water PH, new water temp)
//          clean filter (date, notes)
//          add chemicals (ph Up, ph Down, dechlorinator, salt, copper)

import { HttpClient } from 'aurelia-fetch-client';

export class journalEntries {
  constructor() {
    this.displayName = 'Journal Entries';
    this.newEntry = {};
    this.entries = [];
    this.tanks = [];
    this.newEntry = this.createJournalEntry();
    this.fetchJournalEntries();
    this.fetchTankEntries();
  }

  createJournalEntry() {
    return {
      id: '',
      ph: '',             // 0.0,
      freeAmmonia: '',    // 0.0,
      totalAmmonia: '',   // 0.0,
      nitrite: '',        // 0.0,
      nitrate: '',        // 0.0,
      o2: '',             // 0,
      gh: '',             // 0,
      kh: '',             // 0,
      waterTemp: '',      // 0.0,
      turbidity: '',
      tank: '',
      entryDateTime: new Date()
    };
  }

  fetchJournalEntries() {
    var self = this;

    let http = new HttpClient();

    http.fetch(location.href.replace(/[^/]*$/, '') + 'journalEntries')
      .then((data) => {
        self.entries.push.apply(self.entries, data);
      })
      .catch((err) => {
        console.log('do err stuff: ' + err);
        // log errors to our error logger or database
      });
  }

  fetchTankEntries() {
    var self = this;

    let http = new HttpClient();

    http.fetch(location.href.replace(/[^/]*$/, '') + 'tanks')
      .then((data) => {
        let tankNames = data.map((t) => {
          return t.name;
        });
        self.tanks.push.apply(self.tanks, tankNames);
      })
      .catch((err) => {
        // log errors to our error logger or database
      });
  }

  addJournalEntry() {
    this.entries.push(this.newEntry);

    var self = this;

    let http = new HttpClient();

    http.fetch(location.href.replace(/[^/]*$/, "") + "journalEntry", this.newEntry)
      .then((entry) => {
        self.newEntry.id = entry.id;
        self.newEntry = self.createJournalEntry();
      })
      .catch((err) => {
        // do error stuff
      });
  }

  deleteJournalEntry(entry) {
    var self=this;

    // http://durandaljs.com/documentation/api.html#module/http/method/remove

    let http = new HttpClient();

    http.delete(location.href.replace(/[^/]*$/, "") + "journalEntry/" + entry.id)
      .then(() => {
        //ToDo: remove the entry from the entries array, or just re-load the array?
        self.entries.splice(self.entries.indexOf(entry),1);
      }).catch((err) => {
        console.error('CANNT DELETE TEH ENTREEESZzzzz')
        // do error stuff
      });
  }

  editJournalEntry(entry) {
    this.newEntry = entry;
  }

  cancelUpdate() {
    this.newEntry = this.createJournalEntry();
  }

  updateJournalEntry(entry) {
    var self=this;
    http.put(location.href.replace(/[^/]*$/, "") + "journalEntry/" + this.newEntry.id, this.newEntry)
      .then(function(){
        self.newEntry = self.createJournalEntry();
      }).catch((err) => {
        // do error stuff
        console.log(err);
        self.entries.length = 0;
        self.fetchJournalEntries();
      });
  }
}