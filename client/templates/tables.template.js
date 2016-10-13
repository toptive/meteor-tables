Template.MeteorTable.onCreated(function () {
  let self = this;
  
  let data = Template.currentData().settings;

  // TODO load state from localstorage, maybe Session would be better
  self.settings = new ReactiveVar({
    template: data.template,
    entries: [5, 10, 25, 50, 100],
    current: {
      entry: 5,
      page: 1,
      result: {
        beginPage: 0,
        endPage: 0,
        total: 0
      }
    }
  });

  self.autorun(function () {
    let settings = self.settings.get();

    options = {
      fields: data.fields.reduce((o, e) => { o[e.data] = 1; return o; }, {}),
      limit: settings.current.entry,
      skip: settings.current.page * settings.current.entry - settings.current.entry
    };
    // console.log('subscribing..', options);
    self.subscribe(data.publication, data.selector, options);
  });

  self.getData = function () {
    let settings = self.settings.get();

    return data.collection.find(data.selector, options);
  }
});

Template.MeteorTable.onRendered(function () {
  let self = this;
  // TODO fetch data
  
  let settings = self.settings.get();
  // settings.current.result = {
  //   beginPage: 101,
  //   endPage: 125,
  //   total: 1044
  // };

  self.settings.set(settings);
});

Template.MeteorTable.events({
  // some event
});

Template.MeteorTable.helpers({
  documents: function () {
    return Template.instance().getData();
  },
  template: function () {
    return Template.instance().settings.get().template;
  },
  settings: function () {
    // console.log(Template.instance().settings.get());
    return Template.instance().settings;
  },
  headers: function () {
    let settings = Template.instance().data.settings;

    return settings.fields.map(f => f.title);
  }
});