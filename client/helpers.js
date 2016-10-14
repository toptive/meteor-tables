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