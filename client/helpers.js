/**
 * The global namespace for Helpers
 * @namespace Helpers
 */

Helpers = {};

Helpers.generateSearchFilter = function (selector, columns, searchString, filter) {
  let conjunction = selector;
  let disjunction = {$or: []};

  // filter searchable columns
  disjunction['$or'] = columns
    .filter(c => !('searchable' in c))
    .map(c => { 
      let filter = {}; 
      
      filter[c.data] = { '$regex' :  '.*' + searchString + '.*', '$options' : 'i'}; 

      return filter;
    });

  conjunction['$and'][1] = disjunction;
  if (filter instanceof Object) conjunction['$and'][2] = filter;

  return conjunction;
};

Helpers.generateFieldsFilter = function (columnFields, extraFields) {
  let fields = columnFields.reduce((o, e) => { o[e.data] = 1; return o; }, {});

  if (extraFields) {
    fields = extraFields.reduce((o, e) => {o[e] = 1; return o; }, fields);
  }

  return fields;
};

Helpers.generateDefaultSortingCriteria = function (columnFields) {
  let sortColumn = columnFields.find(column => column.orderable !== false);

  if (!sortColumn) return undefined;
  else {
    let sort = {};
    sort[sortColumn.data] = 1;

    return sort;
  }
};

Helpers.saveSate = function (table_id, settings) {
  window.localStorage.setItem(table_id, JSON.stringify(settings));
};

Helpers.loadState = function (table_id) {
  let settings = window.localStorage.getItem(table_id);

  return JSON.parse(settings);
};