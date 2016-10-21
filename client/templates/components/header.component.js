Template.TableHeader.onCreated(function () {
  let self = this;

  self.settings = self.data.settings;
  self.selector = self.data.selector;
  self.fields = self.data.fields;
  self.filter = self.data.filter;

  self.search = new ReactiveVar(self.settings.get().current.search_string);

  self.autorun(function () {
    let searchString = self.search.get();
    let filter = self.filter.get();
    let settings = Tracker.nonreactive(() => self.settings.get());
    
    let selector = Helpers.generateSearchFilter(
      Tracker.nonreactive(() => self.selector.get()),
      self.fields.get(),
      searchString,
      filter
    );
    
    self.selector.set(selector);
      
    if (settings.current.search_string !== searchString) {
      settings.current.page = 1;
      settings.current.search_string = searchString;
      self.settings.set(settings);
    }
  });
});

Template.TableHeader.onRendered(function () {
  let self = this;
});

var timeoutId;

Template.TableHeader.events({
  'keyup #search-box': function (e, template) {
    e.preventDefault();
    
    let instance = Template.instance();

    clearTimeout(timeoutId);

    timeoutId = setTimeout(function () {      
      instance.search.set(e.currentTarget.value);
    }, 500);
  },
  'click li[role="presentation"] > a': function (e, template) {
    e.preventDefault();
    
    let entry = parseInt(e.currentTarget.dataset.entry);
    
    let settings = Template.instance().settings.get();
    settings.current.entry = entry;
    settings.current.page = 1;
    
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