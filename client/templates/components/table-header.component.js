Template.table_header.onCreated(function () {
  let self = this;

  self.settings = self.data.settings;
  self.fields = self.data.fields;
});

Template.table_header.events({
  'click .sorting': function (e, template) {
    e.preventDefault();
    
    let settings = Template.instance().settings.get();

    let columnToSort = e.currentTarget.dataset.sorting;

    // invert sorting criteria
    if (columnToSort in settings.current.sort) settings.current.sort[columnToSort] *= -1;
    else {
      // set a new sorting criteria
      settings.current.sort = {};
      settings.current.sort[columnToSort] = 1
    }
    
    // update model
    Template.instance().settings.set(settings);
  },
  'click .rm-column': function (e, template) {
    e.preventDefault();
    
    let settings = Template.instance().settings.get();
    let column = Template.currentData().column;

    // update Table headers
    let fields = Template.instance().fields.get();
    fields.splice(fields.findIndex(e => e.data === column.data), 1);
    Template.instance().fields.set(fields);

    // remove row column for the new field
    let newColumns = Session.get(settings.session_id);
    newColumns.splice(newColumns.findIndex(e => e.data === column.data), 1);
    Session.set(settings.session_id, newColumns);

    // update Extra columns dropdown
    settings.dynamic_fields.push(column);
    Template.instance().settings.set(settings);
  }
});

Template.table_header.helpers({
  // updates the view
  sortingClass: (column) => {
    let settings = Template.instance().settings.get();

    if ('orderable' in column && !column.orderable) return '';
    else if (!(column.data in settings.current.sort)) return 'sorting'
    else if (settings.current.sort[column.data] > 0) return 'sorting sorting-asc';
    else if (settings.current.sort[column.data] < 0) return 'sorting sorting-desc';
  }
});