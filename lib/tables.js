/**
 * The global namespace for Tables
 * @namespace Tables
 */
Tables = {};

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

  Tables[options.table_id] = {};
  Tables[options.table_id].pub = options.publication || 'meteor_table_generic_pub';
  Tables[options.table_id].template = options.template || 'meteor_table_generic_template';
  Tables[options.table_id].selector = options.selector || new ReactiveVar({});
  Tables[options.table_id].fields = options.fields;
};
