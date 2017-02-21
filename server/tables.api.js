Meteor.publish('tables.collection.info', function (table_id, collection_name, selector, options) {
  var collection = Package['mongo'].MongoInternals.defaultRemoteCollectionDriver().open(collection_name);
  
  var handle = collection.find(selector, options).observeChanges({
    added: (doc_id) => {
      this.added('tables_records', doc_id, {
        table_id: table_id
      });
    },
    removed: (doc_id) => {
      this.removed('tables_records', doc_id);
    }
  });

  this.ready();
  this.onStop(() => handle.stop());
});

Meteor.publish('tables.collection.total_elems', function (table_id, collection_name, selector) {
  var collection = Package['mongo'].MongoInternals.defaultRemoteCollectionDriver().open(collection_name);

  Counts.publish(this, 'total_elems_'.concat(table_id), collection.find(selector));
});