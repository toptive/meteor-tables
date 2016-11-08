/**
 * The global namespace for Tables.tableRecords
 * @namespace Tables.tableRecords
 */
Tables.tableRecords = new Mongo.Collection('tables_records');

/**
 * Find record by table_id
 * @param  {String} table_id  is the registered table id
 * @return {Object}           is the table record if found, otherwise will return undefined
 */
Tables.getRecord = function (table_id) {
  return Tables.tableRecords.findOne(table_id);
};