Template.table_header.onCreated(function () {
  let self = this;

  self.settings = self.data.settings;
  self.column = self.data.column;
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
  }
});

Template.table_header.helpers({
  column: function () {
    let column = Template.instance().column;

    return {
      data: (column.orderable !== false) ? column.data : undefined,
      title: column.title
    };
  },
  // updates the view
  sortingClass: function (column) {
    let settings = Template.instance().settings.get();

    if (!column.data) return '';
    else if (!(column.data in settings.current.sort)) return 'sorting'
    else if (settings.current.sort[column.data] > 0) return 'sorting sorting-asc';
    else if (settings.current.sort[column.data] < 0) return 'sorting sorting-desc';
  }
});