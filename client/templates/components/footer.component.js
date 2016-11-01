Template.TableFooter.onCreated(function () {
  let self = this;

  self.settings = self.data.settings;
  self.selector = self.data.selector;
  self.queryResult = self.data.result;

  let settings = self.settings.get();
  
  self.autorun(function () {  
    self.subscribe('tables.collection.info', 
      settings.table_id, 
      Tables.registered[settings.table_id].collection._name, 
      self.selector.get()
    );
  });

  self.elemsFound = new ReactiveVar(0);

  self.autorun(function () {
    self.elemsFound.set(Math.min(
      Counts.get('total_elems_'.concat(settings.table_id)),
      settings.hard_limit
    ));
  });
});

Template.TableFooter.onRendered(function () {
  let self = this;

  let settings;

  self.autorun(function () {
    settings = self.settings.get();
    
    self.$('.pagination').pagination({
      items: self.elemsFound.get(),
      currentPage: settings.current.page,
      itemsOnPage: settings.current.entry,
      displayedPages: 3,
      edges: 1,
      ellipsePageSet: false,
      disableAnchors: true,
      onPageClick: onPageClick
    });
  });

  function onPageClick (pageNumber, e) {   
    e.preventDefault();

    settings.current.page = pageNumber;
    
    self.settings.set(settings);
  }
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
      total: Template.instance().elemsFound.get()
    };
  }
})