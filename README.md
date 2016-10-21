qactivo:meteor-tables
=====================

A Meteor package that creates reactive DataTables (not the [DataTables](http://datatables.net/)) in an efficient way, allowing you to display custom contents of enormous collections without impacting app performance.

## Installation

```bash
$ meteor add qactivo:meteor-tables
```

## Online Demo App

Coming soon :stuck_out_tongue_winking_eye:

## Example

### Client

- [ ] Create a new template to render each one of the elements of the published collection (mandatory for now)
```html
<template name="incomplete_todo_row">
  <tr>
    <td>{{_id}}</td>
    <td>{{title}}</td>
    <td>{{description}}</td>
    <td>{{created_at}}</td>
  </tr>
</template>
```

- [ ] Setup table settings inside of some controller/template
```javascript
// We are using Iron Router here, but you can provide the table settings righ in the template
IncompleteTodosController = RouteController.extend({
  template: 'my_incomplete_todos',
  data: function () {
    return {
      table_settings: {
        table_id: 'incomplete_todos_table',
        publication: 'incomplete_todos_table_pub',
        template: 'incomplete_todo_row',
        collection: Todos,
        fields: new ReactiveVar([
          { data: '_id', title: 'User' },
          {
            orderable: false,
            searchable: false,
            data: 'title', 
            title: 'Title'
          },
          { data: 'description', title: 'Description' },
          { data: 'created_at', title: 'Created' }  
        ])
      }
    }
  }
});
```

- [ ] Finally, inject the **MeteorTable** to the html template

```html
<template name="my_incomplete_todos">
  <h2 class="page-header">Incomplete todos</h2>

  {{> MeteorTable settings=table_settings}}
</template>
```

### Server 

- [ ] Create a publication with the following params
```javascript
Meteor.publish('incomplete_todos_table_pub', function (selector, options) {
  var query = {
    $and: [
      // custom selector
      {
        completed: false
      },
      // selector provided by MeteorTable
      selector
    ]
  };

  return Todos.find(query, options);
});
```

## Displaying Only Part of a Collection's Data Set

Add a [Mongo-style selector](https://docs.meteor.com/#/full/selectors) to your `MeteorTable` component for a table that displays only one part of a collection:

```html
{{> MeteorTable settings=table_settings filter=selector}}
```

```js
Template.my_incomplete_todos.helpers({
  selector: function () {    
    var query = {};
    
    // make sure this field is included inside the field columns 
    // or extra fields, otherwise you will get no result!
    query['created_at'] = {};
    query['created_at']['$gte'] = someReactiveVar.get();
    query['created_at']['$lte'] = new Date();

    return query;
  }
});
```

If you want to limit what is published to the client for security reasons you can provide a selector both in the settings which will be used by the publications, and in the publication. Selectors provided this way will be combined with selectors provided to the template using an AND relationship. Both selectors may query on the same fields if necessary.

```js
table_settings: {
  ... // other properties ...
  selector: {
    user_id: userId
  }
}
```

## Searching

If your table includes the global search/filter field, it will work and will update results in a manner that remains fast even with large collections. By default, all columns are searched if they can be. If you don't want a column to be searched, add the `searchable: false` option on that column.

When you enter multiple search terms separated by whitespace, they are searched with an OR condition, which matches default DataTables behavior.

This will generate a new `selector` including this filter to be sent to the publication (i.e., your selector and the search selector are merged with an AND relationship).

## Publishing Extra Fields

If your table's templates,  helper functions or table settings selector require fields that are not included in the data, you can tell MeteorTable to publish these fields by including them in the `extra_fields` array option:

```js
table_settings: {
  ... // other properties ...
  extra_fields: ['deleted', 'date_joined', 'roles']
}
```

## Saving state

Should you require the current state of pagination, sorting, search, etc to be saved you can use the option `state_save`.

Add `state_save` as a property when defining the Datatable.

```js
table_settings: {
  ... // other properties ...
  state_save: true
}
```

## Default column order

Unless there is a saved state, you can provide to MeteorTable your desired column sort using the `default_sort` option:

```js
table_settings: {
  ... // other properties ...
  default_sort: {
    completed: true
  }
}
```
If you don't specify any order criteria, by default MeteorTable will take the first non-searchable column or will not apply sorting at all.

## Using a Custom Publish Function (mandatory for now)

To tell MeteorTable to use your custom publish function, pass the publication name as the `publication` option. Your function:

* MUST accept and two arguments: `selector`, and `options`
* MAY also publish other data necessary for your table

for example:

```js
if (Meteor.isServer) {
  Meteor.publish('incomplete_todos_table', function (selector, options) {
    var query = {
      $and: [
        {
          completed: false,
          created_at: {
            $gt: new Date('2016-02-02')
          }
        },
        selector
      ]
    };
    
    return Todos.find(query, options);
  });
}
```
