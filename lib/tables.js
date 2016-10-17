/**
 * The global namespace for Tables
 * @namespace Tables
 */
Tables = {};

Tables.registered = {};

// TODO Refactor this to get instances of tables
Tables.registerTable = function (options) {

  if (!'table_id' in options)
    throw new Error('Options must specify table_id');
  
  if (options.table_id in Tables)
    throw new Error('Table with table_id: '+options.table_id+' already registered.')

  if (!(options.collection instanceof Mongo.Collection))
    throw new Error('Options must specify collection');

  if ('selector' in options && !(options.selector instanceof ReactiveVar))
    throw new Error('Selector must by instance of ReactiveVar');

  if (!(options.fields instanceof ReactiveVar))
    throw new Error('Options must specify column fields');

  if (options.extra_fields && !(options.extra_fields instanceof Array))
    throw new Error('Selector must by instance of Array');

  Tables.registered[options.table_id] = {};
  Tables.registered[options.table_id].pub = options.publication || 'meteor_table_generic_pub';
  Tables.registered[options.table_id].template = options.template || 'meteor_table_generic_template';
  Tables.registered[options.table_id].selector = options.selector || new ReactiveVar({});
  Tables.registered[options.table_id].collection = options.collection;
  Tables.registered[options.table_id].fields = options.fields;
  Tables.registered[options.table_id].extra_fields = options.extra_fields;
};
