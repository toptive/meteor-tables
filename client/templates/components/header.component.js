Template.TableHeader.onCreated(function () {
  let self = this;

  self.settings = self.data;
});

Template.TableHeader.onRendered(function () {
  let self = this;

  // self.autorun(function (c) {
  //   let settings = self.settings.get();

  //   Session.set(self.settings.tableName, self.settings);
  // });
});

Template.TableHeader.events({
  'keyup #search-box': function (e, template) {
    e.preventDefault();
    
    let searchString = e.currentTarget.value;
    
    let settings = Template.instance().settings.get();
    settings.current.searchString = searchString;

    Template.instance().settings.set(settings);
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