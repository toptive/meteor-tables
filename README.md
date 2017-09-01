qactivo:meteor-tables
=====================

A Meteor package that creates reactive DataTables (not the [DataTables](http://datatables.net/)) in an efficient way, allowing you to display custom contents of enormous collections without impacting app performance.
This package is designed to work with Twitter Bootstrap 3.

## Installation

```bash
$ meteor add qactivo:meteor-tables
```

## Online Demo App

Coming soon :stuck_out_tongue_winking_eye:

## Motivation

We found ourselves we the need of Data tables easily to customize and some features we didn't found on any meteor package out there:

* We wanted to take full control of what and how data is published to the client.
* We wanted to decouple each table row from **MeteorTable** to get a self-contained blaze component, this allow to main things:
  * Customize row events using [Blaze template events](http://blazejs.org/api/templates.html#Template-events).
  * Customize how data is displayed using [Blaze template helpers](http://blazejs.org/api/templates.html#Template-helpers).
* The ability to save any table state (sorting, table lengh, etc.).
* The ability to render columns dinamically.
* The ability to inject into the template a filter selector that will be used both client and server side reactivelly!.
* We wanted to write a package easy to adapt and extend.

## How to use (Example)

# Client

- [ ] Inject the **MeteorTable** to the html template:

```html
<template name="my_todos_template">
  <h2>Todos</h2>
  
  // see Template options below to get more details
  {{> MeteorTable settings=table_settings}}
</template>
```

- [ ] Create a new template to render each one of the elements of the published collection (mandatory for now)
```html
<template name="todo_row">
  <tr>
    <td>{{_id}}</td>
    <td>{{title}}</td>
    <td>{{description}}</td>
    <td>{{created_at}}</td>
    <td>{{author.firstname}} {{author.lastname}}</td>
  </tr>
</template>
```

- [ ] Setup table settings inside of some controller/template
```javascript
// We are using Iron Router here, but you can provide the table settings righ in the template
TodosController = RouteController.extend({
  template: 'my_todos_template',
  data: function () {
    return {
      table_settings: {
        table_id: 'todos_table',
        publication: 'todos_table_pub',
        // this the template created before
        template: 'todo_row',
        collection: Todos,
        fields: [
          { data: '_id', title: 'ID' },
          {
            // this column will not be able to sort or search on it
            orderable: false,
            searchable: false,
            data: 'title', 
            title: 'Title'
          },
          { data: 'description', title: 'Description' },
          { data: 'created_at', title: 'Created' },
          { data: 'author', title: 'Author', search_fields: ['firstname', 'lastname'] } // see fields options
        ]
      }
    }
  }
});
```

# Server 

- [ ] Create a classic Meteor publication as follows (mandatory for now):
* MUST accept two arguments: `selector`, and `options`.

```javascript
Meteor.publish('todos_table_pub', function (selector, options) {
  return Todos.find(selector, options);
});
```

That's it, easy huh?

## Displaying Only Part of a Collection's Data Set

Add a [Mongo-style selector](https://docs.meteor.com/#/full/selectors) to your `MeteorTable` component for a table that displays only one part of a collection:

```html
{{> MeteorTable settings=table_settings filter=selector}}
```

```js
Template.my_todos_template.helpers({
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

If you want to limit what is published to the client for security reasons you can provide a selector in the settings which will be used by the publications. Selectors provided this way will be combined with template filters using an AND relationship. Both selectors may query on the same fields if necessary.

```js
table_settings: {
  ... // other properties ...
  selector: {
    user_id: userId
  }
}
```

By the other hand, you can hard limit how many items will be available to the client, just provide to the table settings the `hard_limit` option:

```js
table_settings: {
  ... // other properties ...
  hard_limit: 250
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

Add `state_save` as a property when defining the **MeteorTable**.

```js
table_settings: {
  ... // other properties ...
  state_save: true
}
```

Data storage for the state information in the browser is performed by use of the `localStorage` or sessionStorage HTML5 APIs.
To be able to uniquely identify each table's state data, information is stored using the `table_id` used on the table settings. If this id changes, the state information will be lost.

Please note that the use of the HTML5 APIs for data storage means that the built in state saving option will not work with IE6/7 as these browsers do not support these APIs.

## Default column order

Unless there is a saved state, you can provide to **MeteorTable** your desired column sort using the `default_sort` option:

```js
table_settings: {
  ... // other properties ...
  default_sort: {
    completed: true
  }
}
```
If you don't specify any order criteria, by default **MeteorTable** will take the first non-searchable column or will not apply sorting at all.

## Specify select entries

Customize the select length menu displayed by **MeteorTable** using the `entries` option:

```js
table_settings: {
  ... // other properties ...
  entries: [10, 20, 30]
}
```

The value displayed is the value used to display items on the table.

## Setup fields to be rendered dynamically

If don't want to see often some column, you can add it to this option. You will be able to remove it and re-add it as many times you want.

```js
table_settings: {
  ... // other properties ...
  dynamic_fields: [
    { data: 'user_id', title: 'User ID' },
    { data: 'deadline', title: 'Deadline' }
  ]
}
```

## Template options

| Property                  | Type             | Details                                                                                         |
|---------------------------|------------------|-------------------------------------------------------------------------------------------------|
| `table_id`                | string           | Table indentifier.                                                                              |
| `publication`             | string           | Publication name, **MeteorTable** will subscribe to this publication.                           |
| `template`                | string           | Template name to be used to render each one of the items found as table's row.                  |
| `collection`              | Mongo.Collection | Mongo collection used to fetch data.                                                            |
| `fields`                  | array      | Columns to be rendered by **HttpMeteorTable** : <ul><li>`title` - column name.</li><li>`data`- collection property.</li><li>`orderable`- whether or not the column should be orderable (default `true`).</li><li>`searchable`- whether or not the column should be searchable (default `true`).</li><li>`search_fields`- in case we have a column where its data is an object, we specify this array with its properties, otherwise this must be set as `searchable: false`</li><li>`options`- you can add here [MongoDB Projection Operators](https://docs.mongodb.com/manual/reference/operator/projection/)</li></ul>  |
| `entries` (optional)      | array            | This parameter allows you to specify the length options that **MeteorTable** shows at top left of the table (default `[10, 25, 50, 100]`).         |
| `selector` (optional)     | object           | A [Mongo-style selector](https://docs.meteor.com/#/full/selectors) to filter both client and server side data. |
| `extra_fields` (optional) | array            | Array of collection properties to be published to the client.                                   |
| `default_sort` (optional) | object           | A [Mongo-style sort](https://docs.meteor.com/api/collections.html#sortspecifiers) for initial column sort (by default will take the first column non-orderable). Only `Object` style sort is supported!.                      |
| `state_save` (optional)   | boolean          | Enable or disable state saving. When enabled **MeteorTable** will store state information such as pagination position, display length, filtering and sorting (default `false`).   |
| `dynamic_fields` (optional)   | array          | Columns to be rendered dynamically. This option will enable a dropdown button on top of the table with all the fields specified in there. You can use the same options as used with `fields` (`searchable`, `orderable`, etc.). |
| `hard_limit` (optional)   | number           | If provided will restrict how many items will be available to the client.                       |
| `classes` (optional)      | string           | Allow to change the table style. By default will apply bootstrap classes `.table` and `.table-hover` |
| `sub_manager` (optional)  | boolean          | Enable or disable the subscription manager to fetch data. |
