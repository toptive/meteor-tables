Template.MeteorTable.onCreated(function () {
  let self = this;
  
  let data = Template.currentData().settings;

  Tables.registerTable(data);
  
  // TODO load state from localstorage, maybe Session would be better
  self.settings = new ReactiveVar({
    template: data.template,
    entries: [5, 10, 25, 50, 100],
    current: {
      entry: 5,
      page: 1
    }
  });

  // Taking ReactiveVar references
  self.fields = data.fields;
  self.selector = data.selector || new ReactiveVar({});
  self.options = new ReactiveVar({});
  self.queryResult = new ReactiveVar(0);

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

    self.queryResult.set(data.collection.find(self.selector.get()).count());

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
  selector: function () {
    // We take this reference to TableFooter component
    return Template.instance().selector;
  },
  fields: function () {
    // We take this reference to TableHeader component
    return Template.instance().fields;
  },
  result: function () {
    return Template.instance().queryResult;
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