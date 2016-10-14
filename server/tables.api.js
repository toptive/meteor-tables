Meteor.publish('tables.collection.info', function (selector) {
  Counts.publish(this, 'total_elems', UsersReport.find(selector));
});