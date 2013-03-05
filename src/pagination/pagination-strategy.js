/**
 * Abstract pagination spec
 */
PJ.PaginationStrategy = new PJ.Class({

  pageSize: 20,

  currentPage: 1,

  view: new PJ.NoPaginationView(),
 
  initialize: function(dataSource) {    
    this.view.render({
      pageSize: this.pageSize,
      dataSetSize: dataSource.size(),
      pages: Math.ceil(dataSource.size() / this.pageSize),
      currentPage: 1
    });
  }

});
PJ.PaginationStrategy.include(PJ.Events);
