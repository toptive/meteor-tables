/**
 * The global namespace for Tables
 * @namespace Tables
 */
Tables = {};

Tables.tablesByName = {};

if (Meteor.isClient) {
  Template.registerHelper('TabularTables', Tables.tablesByName);
}

Tables.Table = function (options) {
  var self = this;

  if (!options) {
    throw new Error('Tables.Table options argument is required');
  }

  if (!options.name) {
    throw new Error('Tables.Table options must specify name');
  }
  self.name = options.name;

  if (!(options.collection instanceof Mongo.Collection)) {
    throw new Error('Tables.Table options must specify collection');
  }
  self.collection = options.collection;

  self.pub = options.pub || 'tabular_genericPub';

  if (options.docLimit) self.docLimit = options.docLimit;
  
  if (_.isArray(options.extraFields)) {
    var fields = {};
    _.each(options.extraFields, function (fieldName) {
      fields[fieldName] = 1;
    });
    self.extraFields = fields;
  }

  self.selector = options.selector;

  if (!options.columns) {
    throw new Error('Tables.Table options must specify columns');
  }

  self.options = _.omit(options, 'collection', 'pub', 'extraFields', 'docLimit', 'name', 'selector');

  Tables.tablesByName[self.name] = self;
};
