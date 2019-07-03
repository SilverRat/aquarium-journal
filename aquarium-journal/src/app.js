import { PLATFORM } from 'aurelia-pal';

export class App {
  configureRouter(config, router) {
    config.title = 'Aquarium Journal';
    config.map([
      { route: "", title: "Welcome", moduleId: PLATFORM.moduleName("welcome/welcome"), nav: true },
      { route: "Journal Entries", moduleId: PLATFORM.moduleName("journal-entries/journalEntries"), nav: true },
      { route: "Tanks", moduleId: PLATFORM.moduleName("tanks/tanks"), nav: true }
    ]);
    this.router = router;
  }
}
