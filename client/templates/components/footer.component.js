Template.TableFooter.onCreated(function () {
  let self = this;

  self.settings = self.data.settings;
  self.selector = self.data.selector;
  self.queryResult = self.data.result;

  self.autorun(function () {
    self.subscribe('tables.collection.info', self.selector.get());
  });
});

Template.TableFooter.onRendered(function () {
  let self = this;

  let settings;

  self.autorun(function () {
    settings = self.settings.get();
    // TODO FIX pagination limit when entry gets higher
    // 
    self.$('.pagination').pagination({
      items: Counts.get('total_elems'),
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
  formatNumber: function (number) {
    return numeral(number).format('0,0');
  },
  result: function () {
    let settings = Template.instance().settings.get();

    let offsetPage = settings.current.entry * (settings.current.page - 1) + 1;
    let itemsFound = offsetPage + Template.instance().queryResult.get() - 1;
    return {
      beginPage: Math.min(offsetPage, itemsFound),
      endPage: itemsFound,
      total: Counts.get('total_elems')
    };
  }
})