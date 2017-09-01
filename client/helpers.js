/**
 * The global namespace for Helpers
 * @namespace Helpers
 */

Helpers = {};

Helpers.generateSearchFilter = function (selector, columns, searchString, filter) {
  let conjunction = selector;
  let disjunction = {$or: []};

  let searchFields = [];
  let regex = { '$regex' :  '.*' + searchString + '.*', '$options' : 'i'};

  // filter searchable columns
  disjunction['$or'] = columns
    .filter(c => !('searchable' in c) || c.searchable)
    .map(c => { 
      let filter = {};

      if (c.search_fields) searchFields = [...searchFields, ...c.search_fields.map(f => `${c.data}.${f}`)];
      else {
        filter[c.data] = regex;
        return filter;
      }
    })
    .filter(c => typeof c !== 'undefined');

  if (searchFields.length > 0) 
    disjunction['$or'] = [
      ...disjunction['$or'],
      ...searchFields.map(f => {
        let filter = {};

        filter[f] = regex;

        return filter;
      })
    ]

  let index = 1;

  if (disjunction['$or'].length > 0) {
    conjunction['$and'][index] = disjunction;
    index++;
  }

  if (filter instanceof Object) {
    conjunction['$and'][index] = filter;
  }
  
  return conjunction;
};

Helpers.generateFieldsFilter = function (columnFields, extraFields) {
  let fields = columnFields.reduce((o, e) => { o[e.data] = e.options || 1; return o; }, {});

  if (extraFields) {
    fields = extraFields.reduce((o, e) => { o[e] = 1; return o; }, fields);
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

Helpers.isEmptyObject = function (obj) {
  for(var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }
  return true;
};

Helpers.saveSate = function (table_id, settings) {
  window.localStorage.setItem(table_id, JSON.stringify(settings));
};

Helpers.loadState = function (table_id) {
  let settings = window.localStorage.getItem(table_id);

  return JSON.parse(settings);
};