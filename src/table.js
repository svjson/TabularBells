/**
 * Table main class
 */
TB.Table = new TB.Class({
  
  view: null,

  dataSource: null,

  columnModel: null,

  paginationStrategy: new TB.NoPagination(),

  init: function() {
    this.initialize();
  },

  initialize: function() {
    this.initializeDataSource();
    this.initializeView();
    this.initializePagination();
    this.paginationStrategy.bind('pagination-changed', this.proxy(this.refreshTable));
    this.view.bind('action-requested', this.proxy(this.actionRequested));
  },

  refreshTable: function() {
    this.view.updateRows({
      data: this.dataSource.get(this.paginationStrategy.getPageQuery()),
      columnModel: this.columnModel
    });
  },

  actionRequested: function(actionData) {
    this.trigger('action-invoked', actionData);
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
      this.dataSource = new TB.ArrayDataSource({data: []});
    }
    this.dataSource.initialize();
  },

  initializePagination: function() {
    this.paginationStrategy.initialize(this.dataSource);
  }

});
