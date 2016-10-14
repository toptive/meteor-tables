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

  // Taking ReactiveVar references
  self.selector = data.selector;
  self.fields = data.fields;
  self.options = new ReactiveVar({});

  self.autorun(function () {
    let settings = self.settings.get();

    self.options.set({
      fields: self.fields.get().reduce((o, e) => { o[e.data] = 1; return o; }, {}),
      limit: settings.current.entry,
      skip: settings.current.page * settings.current.entry - settings.current.entry
    });
  });

  self.autorun(function () {
    self.subscribe(data.publication, self.selector.get(), self.options.get());
  });

  self.getData = function () {
    return data.collection.find(self.selector.get());
  }
});

Template.MeteorTable.onRendered(function () {
  let self = this;
});

Template.MeteorTable.events({
  // some events
});

Template.MeteorTable.helpers({
  settings: function () {
    // We take this reference to TableHeader and TableFooter components
    return Template.instance().settings;
  },
  documents: function () {
    return Template.instance().getData();
  },
  template: function () {
    return Template.instance().settings.get().template;
  },
  headers: function () {
    let fields = Template.instance().fields.get();

    return fields.map(f => f.title);
  }
});