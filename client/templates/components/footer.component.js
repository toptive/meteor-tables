Template.TableFooter.onCreated(function () {
  let self = this;

  self.settings = self.data.settings;
  self.selector = self.data.selector;
  self.queryResult = self.data.result;

  self.autorun(function () {
    let table_id = self.settings.get().table_id;
    
    self.subscribe('tables.collection.info', 
      table_id, 
      Tables.registered[table_id].collection._name, 
      self.selector.get()
    );
  });
});

Template.TableFooter.onRendered(function () {
  let self = this;

  let settings;

  self.autorun(function () {
    settings = self.settings.get();
    let totalElementsFound = Counts.get('total_elems_'.concat(settings.table_id));
    
    self.$('.pagination').pagination({
      items: totalElementsFound,
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
  formatNumber: (number) => {
    return numeral(number).format('0,0');
  },
  result: () => {
    let settings = Template.instance().settings.get();

    let offsetPage = settings.current.entry * (settings.current.page - 1) + 1;
    let itemsFound = offsetPage + Template.instance().queryResult.get() - 1;

    return {
      beginPage: Math.min(offsetPage, itemsFound),
      endPage: itemsFound,
      total: Counts.get('total_elems_'.concat(settings.table_id))
    };
  }
})