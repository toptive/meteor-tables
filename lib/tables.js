/**
 * The global namespace for Tables
 * @namespace Tables
 */
Tables = {};

Tables.registered = {};

Tables.registerTable = function (options) {

  if (!'table_id' in options)
    throw new Error('Options must specify table_id');
  
  if (options.table_id in Tables)
    throw new Error('Table with table_id: '+options.table_id+' already registered.')

  if (!(options.collection instanceof Mongo.Collection))
    throw new Error('Options must specify collection');

  if ('selector' in options && !(options.selector instanceof Object))
    throw new Error('Selector must by instance of Object');

  if (!(options.fields instanceof ReactiveVar))
    throw new Error('Options must specify column fields');

  if ('extra_fields' in options && !(options.extra_fields instanceof Array))
    throw new Error('Extra fields must by instance of Array');
  
  if ('default_sort' in options && !(options.default_sort instanceof Object))
    throw new Error('Default sort must by instance of Object');

  Tables.registered[options.table_id] = {};
  Tables.registered[options.table_id].pub = options.publication || 'meteor_table_generic_pub';
  Tables.registered[options.table_id].template = options.template || 'meteor_table_generic_template';
  Tables.registered[options.table_id].selector = options.selector;
  Tables.registered[options.table_id].collection = options.collection;
  Tables.registered[options.table_id].fields = options.fields;
  Tables.registered[options.table_id].extra_fields = options.extra_fields;
  Tables.registered[options.table_id].default_sort = options.default_sort || Helpers.generateDefaultSortingCriteria(options.fields.get());
  Tables.registered[options.table_id].state_save = options.state_save;

  return Tables.registered[options.table_id];
};