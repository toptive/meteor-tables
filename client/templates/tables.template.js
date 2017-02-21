Template.MeteorTable.onCreated(function () {
  let self = this;
  
  let data = Template.currentData().settings;

  const TABLE = Tables.registerTable(data);
  
  Template[TABLE.template].onRendered(function () {
    this.autorun(() => {
      let newColumns = Session.get(TABLE.session_id);

      if (newColumns) {
        newColumns.forEach((column) => {
          lastNode = $(this.lastNode).append($('<td>'+this.data[column.data]+'</td>'));
        });
      }
    });
  });

  let state = TABLE.state_save ? Helpers.loadState(data.table_id) : null;

  self.settings = new ReactiveVar({
    table_id: data.table_id,
    template: TABLE.template,
    entries: TABLE.entries,
    current: {
      entry: state ? state.length : TABLE.entries[0],
      page: state ? state.start : 1,
      sort: state ? state.order : TABLE.default_sort,
      search_string: state ? state.search : ''
    },
    dynamic_fields: TABLE.dynamic_fields,
    session_id: TABLE.session_id,
    hard_limit: TABLE.hard_limit
  });

  // Taking ReactiveVar references
  self.fields = new ReactiveVar(TABLE.fields);
  self.selector = new ReactiveVar(
    Helpers.generateSearchFilter(
      TABLE.selector,
      TABLE.fields,
      state ? state.search : ''
    )
  );
  self.options = new ReactiveVar({});
  self.filter = new ReactiveVar({});
  self.queryResult = new ReactiveVar(0);
  self.recordsIds = new ReactiveVar([]);

  self.autorun(function () {
    let cursor = Tables.tableRecords.find({table_id: data.table_id});

    self.recordsIds.set(cursor.map(d => d._id));
  });

  self.autorun(function () {
    let externalFilter = Template.currentData().filter;
    Tracker.nonreactive(() => self.filter.set(externalFilter || {}));
  });

  // watch external filter changes to reset page
  self.autorun(function (c) {
    let externalFilter = self.filter.get();
    if (!c.firstRun){
      let settings = Tracker.nonreactive(() => self.settings.get());
      
      settings.current.page = 1;
      self.settings.set(settings);
    }
  });

  self.autorun(function () {
    let settings = self.settings.get();

    self.options.set({
      fields: Helpers.generateFieldsFilter(self.fields.get(), TABLE.extra_fields),
      limit: settings.current.entry,
      skip: settings.current.page * settings.current.entry - settings.current.entry,
      sort: settings.current.sort
    });

    console.log(self.options.get());
  });

  self.autorun(function () {
    subs.subscribe(TABLE.pub, self.selector.get(), self.options.get());
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
    let cursor = TABLE.collection.find({
      _id: {
        $in: self.recordsIds.get()
      }
    }, 
      _.pick(self.options.get(), 'sort')
    );

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
  options: () => {
    // We take this reference to TableFooter component
    return Template.instance().options;
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
  },
  classes: () => {
    return Template.currentData().settings.classes;
  }
});