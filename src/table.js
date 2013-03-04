/**
 * Table main class
 */
PJ.Table = new PJ.Class({
  
  view: null,

  dataSource: null,

  paginationStrategy: null,

  init: function() {
    this.initializeView();
    this.initializeDataSource();
  },

  initializeView: function() {
    if (!this.view) {
      throw new Error("No view specified.");
    }
    this.view.initialize();
  },

  initializeDataSource: function() {
    if (!this.dataSource) {
      this.dataSource = new PJ.ArrayDataSource({data: []});
    }
    this.dataSource.initialize();
  }

});
