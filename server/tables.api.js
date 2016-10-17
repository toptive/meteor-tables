Meteor.publish('tables.collection.info', function (table_id, collection_name, selector) {
  var collection = Package['mongo'].MongoInternals.defaultRemoteCollectionDriver().open(collection_name);
  
  Counts.publish(this, 'total_elems_'.concat(table_id), collection.find(selector));
});