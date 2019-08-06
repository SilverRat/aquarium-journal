import { HttpClient } from 'aurelia-fetch-client';

export class tanks {

  constructor() {
    this.displayName = 'Tanks';
    this.newEntry = {};
    this.entries = [];

    this.newEntry = this.createTankEntry();
    this.fetchTankEntries();
  }

  createTankEntry() {
    return {
      id: '',
      tankName: '', // Friendly name to id tanks
      tankVolume: '', // in gallons
      tankHeight: '', // in inches
      tankWidth: '', // in inches
      tankDepth: '', // in inches
      entryDateTime: new Date()
    }
  }

  fetchTankEntries() {
    let self = this;
    const http = new HttpClient();

    http.fetch(location.href.replace(/[^/]*$/, "") + "tanks")
      .then((data) => {
        self.entries.push.apply(self.entries, data);
      })
      .catch((err) => {
        // do error stuff
      });
  }

  addTankEntry() {
    const self = this;
    const http = new HttpClient();

    http.post("http://localhost:3000/tank", JSON.stringify(self.newEntry))
      .then(entry => entry.json())
      .then(tank => this.entries.push(tank))
      .catch(() => {
        // do error stuff
      });
  }

  deleteTankEntry() {
    let self = this;
    const http = new HttpClient();

    http.remove(location.href.replace(/[^/]*$/, "") + "tank/" + entry.id)
      .then(() => {
        //ToDo: remove the entry from the entries array, or just re-load the array?
        self.entries.splice(self.entries.indexOf(entry),1);
      }).catch((err) => {
        // do error stuff
      });
  }

  // edit will stage the data for editing, a subsequent save will call update, or cancel will exit editing.
  // UNEXPECTED BEHAVIOR.  This appears to pass in the data in the "entry" field that are data bound for that element,
  //  NOT the full record.  Since the new record type is NOT bound, it gets lost in the update and can no longer be
  //  queried with the record type filter. I think I could look it up in the array, but it would probably be lost again in
  //  the detail view.  SO, since this is an implemenation detail of the schema, I'm ensuring the record type is always set
  //  correctly in the REST interface.
  editTankEntry = (entry) => {
    this.newEntry = entry;
  };

  cancelUpdate = () => {
    this.newEntry = this.createTankEntry();
  };

  onClickTankSelection = (entry) => {
    this.newEntry.tank = entry;
  };

  updateTankEntry = (entry) => {
    const self = this;
    const http = new HttpClient();

    http.put(location.href.replace(/[^/]*$/, "") + "tank/" + this.newEntry.id, this.newEntry)
      .then(() => {
        self.newEntry = self.createTankEntry();
      }).catch((err) => {
        // do error stuff
        console.log(err);
        self.entries.length = 0;
        self.fetchTankEntries();
      });
  }
}