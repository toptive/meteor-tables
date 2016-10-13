qactivo:meteor-tables
=====================

## How to use

- [ ] Create a publication with the following params
```
Meteor.publish('incomplete_profiles_table', function (selector, options) {
  return SomeCollectionHere.find(selector, options);
});
```

- [ ] Create a new template to render each one of the elements of the published collection
```
<template name="incomplete_user_row">
  <tr>
    <td>{{username}}</td>
    <td>{{firstname}}</td>
    <td>{{email}}</td>
    <td><a target="_blank" href="{{facebook_link}}">Facebook</a></td>
    <td>{{age}}</td>
    <td>{{sex}}</td>
    <td>{{race}}</td>
    <td>{{statusProfile}}</td>
  </tr>
</template>
```
- [ ] Setup table settings inside of some controller/template
```
ExampleController = RouteController.extend({
  template: 'example_template',
  data: function () {
    return {
      table_settings: {
        publication: 'incomplete_profiles_table',
        template: 'incomplete_user_row',
        collection: SomeCollectionHere,
        selector: {
          age: {$gt: 25}
        },
        fields: [
          { data: 'username', title: 'User' },
          { data: 'firstname', title: 'Name' },
          { data: 'email', title: 'Contact Email' },
          {
            orderable: false,
            searchable: false,
            data: 'facebook_link', 
            title: 'See Facebook Profile'
          },
          { data: 'age', title: 'Age' },
          { data: 'sex', title: 'Gender' },
          { data: 'race', title: 'Race' },
          { data: 'statusProfile', title: 'Status Profile' }      
        ]
      }
    }
  }
});
```

- [ ] Finally, inject the **MeteorTable** to the html template

```
<template name="example_template">
  <h2 class="page-header">Example page</h2>

  {{> MeteorTable settings=table_settings}}
</template>
```
