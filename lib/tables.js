const DEFAULT_PUBLICATION = 'meteor_table_generic_pub';
const DEFAULT_TEMPLATE = 'meteor_table_generic_template';
const DEFAULT_ENTRIES = [10, 25, 50, 100];

const subs = new SubsManager();

/**
 * The global namespace for Tables
 * @namespace Tables
 */
Tables = {};

Tables.registered = {};

Tables.registerTable = function (options) {

  if (typeof options.table_id !== 'string')
    throw new Error('Options must specify table_id');
  
  if (options.table_id in Tables)
    throw new Error('Table with table_id: '+options.table_id+' already registered.')

  if (!(options.collection instanceof Mongo.Collection))
    throw new Error('Options must specify collection');

  if (!(options.fields instanceof Object))
    throw new Error('Options must specify column fields');
  
  if ('selector' in options && !(options.selector instanceof Object))
    throw new Error('Selector must by instance of Object');

  if ('extra_fields' in options && !(options.extra_fields instanceof Array))
    throw new Error('Extra fields must by instance of Array');

  if ('dynamic_fields' in options && !(options.dynamic_fields instanceof Array))
    throw new Error('Extra fields must by instance of Array');

  if ('entries' in options && !(options.entries instanceof Array))
    throw new Error('Entries option must by instance of Array');
  
  if ('default_sort' in options && !(options.default_sort instanceof Object))
    throw new Error('Default sort must by instance of Object');

  if ('state_save' in options && (typeof options.state_save !== 'boolean'))
    throw new Error('State save option must by instance of boolean');

  if ('hard_limit' in options && (typeof options.hard_limit !== 'number'))
    throw new Error('Hard limit option must by instance of number');

  if ('classes' in options && (typeof options.classes !== 'string'))
    throw new Error('Classes option must by instance of string');

  if ('sub_manager' in options && (typeof options.sub_manager !== 'boolean'))
    throw new Error('Subscription manager option must by instance of boolean');

  Tables.registered[options.table_id] = {};
  Tables.registered[options.table_id].pub = options.publication || DEFAULT_PUBLICATION;
  Tables.registered[options.table_id].template = options.template || DEFAULT_TEMPLATE;
  Tables.registered[options.table_id].selector = options.selector ? {$and: [options.selector]} : {$and: [{}]};
  Tables.registered[options.table_id].collection = options.collection;
  Tables.registered[options.table_id].fields = options.fields;
  Tables.registered[options.table_id].entries = options.entries || DEFAULT_ENTRIES;
  Tables.registered[options.table_id].default_sort = options.default_sort || Helpers.generateDefaultSortingCriteria(options.fields);
  
  if ('extra_fields' in options) {
    Tables.registered[options.table_id].extra_fields = options.extra_fields;
  }
  
  if ('state_save' in options) {
    Tables.registered[options.table_id].state_save = options.state_save;
  }
  
  if ('classes' in options) {
    Tables.registered[options.table_id].classes = options.classes;
  }
  
  if ('sub_manager' in options) {
    Tables.registered[options.table_id].sub_manager = subs;
  }

  Tables.registered[options.table_id].hard_limit = ('hard_limit' in options)
    ? options.hard_limit
    : Number.MAX_VALUE;

  if ('dynamic_fields' in options) {
    Tables.registered[options.table_id].dynamic_fields = options.dynamic_fields;
    Tables.registered[options.table_id].session_id = options.table_id.concat('_new_columns');
  }
  
  return Tables.registered[options.table_id];
};