Template.TableFooter.onCreated(function () {
  let self = this;

  self.settings = self.data.settings;
  self.selector = self.data.selector;
  self.options = self.data.options;
  self.queryResult = self.data.result;

  self.totalItems = new ReactiveVar(0);

  let settings = self.settings.get();
  let TABLE = Tables.registered[settings.table_id];

  self.subManager = TABLE.sub_manager ? TABLE.sub_manager : self;

  self.getTotalElems = function () {
    return Counts.get('total_elems_'.concat(settings.table_id));
  };

  self.autorun(function () {
    self.subscribe('tables.collection.total_elems', 
      settings.table_id,
      TABLE.collection._name,
      self.selector.get()
    );
  });

  self.autorun(function () {
    self.handle = self.subscribe('tables.collection.info', 
      settings.table_id, 
      TABLE.collection._name, 
      self.selector.get(),
      self.options.get()
    );
  });

  self.autorun(function () {
    self.totalItems.set(Math.min(
      self.getTotalElems(),
      settings.hard_limit
    ));
  });
});

Template.TableFooter.onRendered(function () {
  let self = this;

  let settings;

  self.autorun(function () {
    settings = self.settings.get();
    
    self.$('.pagination')
      .pagination({
        items: self.totalItems.get(),
        currentPage: settings.current.page,
        itemsOnPage: settings.current.entry,
        displayedPages: 3,
        edges: 1,
        ellipsePageSet: false,
        disableAnchors: true,
        onPageClick: onPageClick
      })
      .pagination(self.handle.ready() ? 'enable' : 'disable');
  });

  function onPageClick (pageNumber, e) {   
    e.preventDefault();

    settings.current.page = pageNumber;
    
    self.settings.set(settings);
  }

  self.autorun(function () {
    if (self.handle.ready()) {
      let settings = Tracker.nonreactive(() => self.settings.get());
      if (settings.current.entry >= self.getTotalElems() && settings.current.page !== 1) {
        settings.current.page = 1;
        self.settings.set(settings);
      }
    }
  });
});

Template.TableFooter.helpers({
  formatNumber: (number) => numeral(number).format('0,0'),
  result: () => {
    let settings = Template.instance().settings.get();

    let offsetPage = settings.current.entry * (settings.current.page - 1) + 1;
    let itemsFound = offsetPage + Template.instance().queryResult.get() - 1;

    return {
      beginPage: Math.min(offsetPage, itemsFound),
      endPage: itemsFound,
      total: Template.instance().totalItems.get()
    };
  }
})