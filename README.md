qactivo:meteor-tables
=====================

## How to use

- [ ] Create a publication with the following params
```javascript
Meteor.publish('incomplete_profiles_table', function (selector, options) {
  return SomeCollectionHere.find(selector, options);
});
```

- [ ] Create a new template to render each one of the elements of the published collection
```html
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
```javascript
ExampleController = RouteController.extend({
  template: 'example_template',
  data: function () {
    return {
      table_settings: {
        table_id: 'incomplete_profiles_table',
        publication: 'incomplete_profiles_table',
        template: 'incomplete_user_row',
        collection: SomeCollectionHere,
        // optional
        selector: new ReactiveVar({
          age: {$gt: 25}
        }),
        // optional
        extra_fields: ['deleted'],
        // optional
        default_sort: {
          firstname: -1
        },
        fields: new ReactiveVar([
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
        ])
      }
    }
  }
});
```

- [ ] Finally, inject the **MeteorTable** to the html template

```html
<template name="example_template">
  <h2 class="page-header">Example page</h2>

  {{> MeteorTable settings=table_settings}}
</template>
```
# License

The MIT License

Copyright (c) 2016 QActivo Company http://qactivo.com/

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
