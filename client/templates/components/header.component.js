Template.TableHeader.onCreated(function () {
  let self = this;

  self.settings = self.data.settings;
  self.selector = self.data.selector;
  self.fields = self.data.fields;
});

Template.TableHeader.onRendered(function () {
  let self = this;

  // self.autorun(function (c) {
  //   let settings = self.settings.get();

  //   Session.set(self.settings.tableName, self.settings);
  // });
});

var timeoutId;

Template.TableHeader.events({
  'keyup #search-box': function (e, template) {
    e.preventDefault();
    
    let instance = Template.instance();
    
    clearTimeout(timeoutId);

    timeoutId = setTimeout(function () {
      let searchString = e.currentTarget.value;
      
      let selector = Helpers.generateSearchFilter(
        instance.selector.get(),
        instance.fields.get(),
        searchString
      );
      
      instance.selector.set(selector);
    }, 500);
  },
  'click li[role="presentation"] > a': function (e, template) {
    e.preventDefault();
    
    let entry = parseInt(e.currentTarget.dataset.entry);
    
    let settings = Template.instance().settings.get();
    settings.current.entry = entry;
    
    Template.instance().settings.set(settings);
  }
});

Template.TableHeader.helpers({
  selectedEntry: (entry) => {
    return entry === Template.instance().settings.get().current.entry ? 'active' : '';
  },
  settings: () => {
    return Template.instance().settings.get();
  }
});