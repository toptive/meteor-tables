Template.MeteorTable.onCreated(function () {
  let self = this;
  
  // TODO load state from localstorage, maybe Session would be better
  
  self.settings = new ReactiveVar({
    entries: [25, 50, 100],
    current: {
      entry: 50,
      page: 1,
      result: {
        beginPage: 0,
        endPage: 0,
        total: 0
      }
    }
  });
});

Template.MeteorTable.onRendered(function () {
  let self = this;
  // TODO fetch data
  
  let settings = self.settings.get();
  settings.current.result = {
    beginPage: 101,
    endPage: 125,
    total: 1044
  };

  self.settings.set(settings);
});

Template.MeteorTable.events({
  // some event
});

Template.MeteorTable.helpers({
  settings: function () {
    console.log(Template.instance().settings.get());
    return Template.instance().settings;
  }
});