Package.describe({
  name: 'qactivo:meteor-tables',
  summary: 'Reactive tables for large or small datasets in Meteor',
  version: '0.0.1'
});

Package.onUse(function (api) {

  var both = ['client', 'server'];

  api.versionsFrom(['METEOR@1.0']);
  
  api.use([
    'jquery',
    'check',
    'underscore',
    'mongo',
    'blaze',
    'templating',
    'reactive-var',
    'tracker',
    'tmeasday:publish-counts',
    'numeral:numeral'
  ]);


  api.addFiles('lib/tables.js', both);

  api.addFiles('server/tables.api.js', 'server');
  
  api.addFiles([
    'client/lib/simplePagination.js',
    'client/templates/components/header.component.html',
    'client/templates/components/header.component.js',
    'client/templates/components/footer.component.html',
    'client/templates/components/footer.component.js',
    'client/templates/tables.template.html',
    'client/templates/tables.template.js',
    'client/helpers.js',
    'client/records.js',
    'client/init.js'
  ], 'client');

  api.export('Tables');
});