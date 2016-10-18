Template.MeteorTable.onCreated(function () {
  let self = this;
  
  let data = Template.currentData().settings;

  const TABLE = Tables.registerTable(data);
  
  self.settings = new ReactiveVar({
    table_id: data.table_id,
    template: TABLE.template,
    entries: [5, 10, 25, 50, 100], // TODO make this customizable
    current: {
      entry: 5,
      page: 1,
      sort: TABLE.default_sort
    }
  });

  // Taking ReactiveVar references
  self.fields = TABLE.fields;
  self.selector = TABLE.selector;
  self.options = new ReactiveVar({});
  self.queryResult = new ReactiveVar(0);

  self.autorun(function () {
    let settings = self.settings.get();

    self.options.set({
      fields: Helpers.generateFieldsFilter(self.fields.get(), TABLE.extra_fields),
      limit: settings.current.entry,
      skip: settings.current.page * settings.current.entry - settings.current.entry,
      sort: settings.current.sort
    });
  });

  self.autorun(function () {
    self.subscribe(TABLE.pub, self.selector.get(), self.options.get());
  });
  
  self.autorun(function () {
    let settings = self.settings.get();

    if (TABLE.save_state)
      Helpers.saveSate(data.table_id, settings);
  });

  self.getData = function () {
    let cursor = TABLE.collection.find(self.selector.get());

    self.queryResult.set(cursor.count());

    return cursor;
  }
});

Template.MeteorTable.onRendered(function () {
  let self = this;
});

Template.MeteorTable.events({
  // some events
});

Template.MeteorTable.helpers({
  settings: () => {
    // We take this reference to TableHeader and TableFooter components
    return Template.instance().settings;
  },
  selector: () => {
    // We take this reference to TableFooter component
    return Template.instance().selector;
  },
  fields: () => {
    // We take this reference to TableHeader component
    return Template.instance().fields;
  },
  result: () => {
    return Template.instance().queryResult;
  },
  documents: () => {
    return Template.instance().getData();
  },
  template: () => {
    return Template.instance().settings.get().template;
  },
  table_headers: () => {
    return Template.instance().fields.get();
  }
});