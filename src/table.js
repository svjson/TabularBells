/**
 * Table main class
 */
PJ.Table = new PJ.Class({
  
  view: null,

  dataSource: null,

  columnModel: null,

  paginationStrategy: new PJ.NoPagination(),

  init: function() {
    this.initializeDataSource();
    this.initializeView();
    this.initializePagination();

    this.paginationStrategy.bind('pagination-changed', this.proxy(this.refreshTable));
  },

  refreshTable: function() {
    this.view.updateRows({
      data: this.dataSource.get(this.paginationStrategy.getPageQuery()),
      columnModel: this.columnModel
    });
  },

  initializeView: function() {
    if (!this.view) {
      throw new Error("No view specified.");
    }
    this.view.initialize(this.columnModel);
    this.refreshTable();
  },

  initializeDataSource: function() {
    if (!this.dataSource) {
      this.dataSource = new PJ.ArrayDataSource({data: []});
    }
    this.dataSource.initialize();
  },

  initializePagination: function() {
    this.paginationStrategy.initialize(this.dataSource);
  }

});
