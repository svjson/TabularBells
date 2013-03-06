/**
 * Abstract pagination spec
 */
TB.PaginationStrategy = new TB.Class({

  pageSize: 20,

  currentPage: 1,

  view: new TB.NoPaginationView(),
 
  initialize: function(dataSource) {    
    this.maxPage = Math.ceil(dataSource.size() / this.pageSize);
    if (this.currentPage > this.maxPage) this.currentPage = this.maxPage;
    this.view.render({
      pageSize: this.pageSize,
      dataSetSize: dataSource.size(),
      pages: this.maxPage,
      currentPage: this.currentPage
    });
  }

});
TB.PaginationStrategy.include(TB.Events);
