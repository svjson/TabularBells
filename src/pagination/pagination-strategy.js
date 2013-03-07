/**
 * Abstract pagination spec
 */
TB.PaginationStrategy = new TB.Class({

  pageSize: 20,

  currentPage: 1,

  view: new TB.NoPaginationView(),
 
  initialize: function(dataSource) {    
    dataSource.size(this.proxy(function(dataSetSize) {
      this.maxPage = Math.ceil(dataSetSize / this.pageSize);
      if (this.currentPage > this.maxPage) this.currentPage = this.maxPage;
      if (this.currentPage == 0) this.currentPage = 1;
      this.view.render({
	pageSize: this.pageSize,
	dataSetSize: dataSetSize,
	pages: this.maxPage,
	currentPage: this.currentPage
      });
    }));
  }

});
TB.PaginationStrategy.include(TB.Events);
