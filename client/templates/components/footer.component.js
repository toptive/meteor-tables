Template.TableFooter.onCreated(function () {
  let self = this;

  self.settings = self.data;
});

Template.TableFooter.onRendered(function () {
  let self = this;

  $('.pagination').pagination({
    items: 100, // TODO 
    itemsOnPage: 10, // TODO SET SELECTED ENTRIES FROM header.component
    displayedPages: 3,
    edges: 1,
    ellipsePageSet: false,
    disableAnchors: true,
    onPageClick: function (pageNumber, e) {      
      let settings = self.settings.get();
      settings.current.page = pageNumber;
      
      self.settings.set(settings);
    }
  });

});

Template.TableFooter.helpers({
  formatNumber: function (number) {
    return numeral(number).format('0,0');
  },
  result: function () {
    return Template.instance().settings.get().current.result;
  }
})