/**
 * The global namespace for Helpers
 * @namespace Helpers
 */

Helpers = {};

Helpers.generateSearchFilter = function (selector, columns, searchString) {
  let conjunction = ('$and' in selector ) ? selector : {$and: [selector]};

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