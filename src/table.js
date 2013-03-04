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
  },

  initializeView: function() {
    if (!this.view) {
      throw new Error("No view specified.");
    }
    this.view.initialize(this.columnModel);
    this.view.updateRows({
      data: this.dataSource.get(this.paginationStrategy.getPageQuery()),
      columnModel: this.columnModel
    });
  },

  initializeDataSource: function() {
    if (!this.dataSource) {
      this.dataSource = new PJ.ArrayDataSource({data: []});
    }
    this.dataSource.initialize();
  }

});
