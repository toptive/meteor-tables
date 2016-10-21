Template.MeteorTable.onCreated(function () {
  let self = this;
  
  let data = Template.currentData().settings;

  const TABLE = Tables.registerTable(data);
  
  let state = TABLE.state_save ? Helpers.loadState(data.table_id) : null;

  self.settings = new ReactiveVar({
    table_id: data.table_id,
    template: TABLE.template,
    entries: [5, 10, 25, 50, 100], // TODO make this customizable
    current: {
      entry: state ? state.length : 5,
      page: state ? state.start : 1,
      sort: state ? state.order : TABLE.default_sort,
      search_string: state ? state.search : ''
    }
  });

  // Taking ReactiveVar references
  self.fields = TABLE.fields;
  self.selector = new ReactiveVar(
    Helpers.generateSearchFilter(
      TABLE.selector,
      TABLE.fields.get(),
      state ? state.search : ''
    )
  );
  self.options = new ReactiveVar({});
  self.filter = new ReactiveVar({});
  self.queryResult = new ReactiveVar(0);

  self.autorun(function () {
    self.filter.set(Template.currentData().filter || {});
  });

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

    if (TABLE.state_save) {
      let state = {
        time: +new Date(),
        start: settings.current.page,
        length: settings.current.entry,
        order: settings.current.sort,
        search: settings.current.search_string || ''
      };

      Helpers.saveSate(data.table_id, state);
    }
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
  filter: () => {
    // We take this reference to TableHeader component
    return Template.instance().filter;
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