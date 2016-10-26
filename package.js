Package.describe({
  name: 'qactivo:meteor-tables',
  summary: 'Reactive tables for large or small datasets in Meteor',
  git: 'https://github.com/QActivo/meteor-tables.git',
  version: '1.0.4'
});

Package.onUse(function (api) {

  var both = ['client', 'server'];

  api.versionsFrom(['METEOR@1.0']);
  
  api.use([
    'jquery',
    'check',
    'mongo',
    'templating@1.2.15',
    'reactive-var',
    'tracker',
    'tmeasday:publish-counts@0.8.0',
    'numeral:numeral@1.5.3_1',
    'fortawesome:fontawesome@4.6.3',
    'fourseven:scss@3.8.1'
  ]);

  api.addFiles('lib/tables.js', both);

  api.addFiles('server/tables.api.js', 'server');
  
  api.addFiles([
    'client/lib/simplePagination.js',
    'client/templates/components/table-header.component.html',
    'client/templates/components/table-header.component.js',
    'client/templates/components/header.component.html',
    'client/templates/components/header.component.js',
    'client/templates/components/footer.component.html',
    'client/templates/components/footer.component.js',
    'client/templates/tables.template.html',
    'client/templates/tables.template.js',
    'client/scss/components/_table_headers.scss',
    'client/scss/components/_header.scss',
    'client/scss/components/_footer.scss',
    'client/scss/main.scss',
    'client/helpers.js',
    'client/records.js'
  ], 'client');
});
