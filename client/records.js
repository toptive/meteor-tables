// We are creating a named client Collection that we will only modify from server
Tables.tableRecords = new Mongo.Collection('tables_records');

/**
 * Find record by name
 * @param  {String} name  is the record name
 * @return {Object}       is the table record if found, otherwise will return undefined
 */
Tables.getRecord = function (name) {
  return Tables.tableRecords.findOne(name);
};