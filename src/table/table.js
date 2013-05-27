/**
 * Table main class
 */
TB.Table = new TB.Class({
  
  view: null,

  dataSource: null,

  columnModel: null,

  paginationStrategy: new TB.NoPagination(),

  resultView: new TB.ResultView(),

  init: function() {
    this.initialize();
  },
  
  initialize: function() {
    this.initializeDataSource(this.proxy(function() {
      this.initializeView();
      this.initializePagination();

      this.paginationStrategy.bind('pagination-changed', this.proxy(this.refreshTable));
      this.dataSource.bind('data-changed', this.proxy(this.initializePagination));
      this.dataSource.bind('data-changed', this.proxy(this.refreshTable));
      this.dataSource.bind('loading-initiated', this.proxy(this.showLoadingStatus));

      this.view.bind('column-filter-updated', this.proxy(this.columnFilterUpdated));
    }));
  },

  refreshTable: function() {
    var pageQuery = this.paginationStrategy.getPageQuery();
    this.dataSource.get(pageQuery, this.proxy(function(data) {
      this.view.updateRows({
        data: data,
        columnModel: this.columnModel
      });      
      this.resultView.update(pageQuery, data, this.dataSource.cachedSize);
    }));
  },

  showLoadingStatus: function() {
    this.view.showLoadingStatus();
  },

  initializeView: function() {
    if (!this.view) {
      throw new Error("No view specified.");
    }
    this.view.initialize(this.columnModel);
    if (this.selectionMode) {
      this.view.selectionMode = this.selectionMode;
    }
    this.refreshTable();
  },

  initializeDataSource: function(callback) {
    if (!this.dataSource) {
      this.dataSource = new TB.ArrayDataSource([]);
    }
    this.dataSource.initialize(callback);
  },

  initializePagination: function() {
    this.paginationStrategy.initialize(this.dataSource);
  },

  bindAction: function(actionId, handler) {
    this.view.bind('action-requested', this.proxy(function(eventData) {
      if (eventData.action === actionId) {
	handler(eventData.row);
      }
    }));
  },

  onSelectRow: function(handler) {
    this.view.bind('row-selected', this.proxy(function(eventData) {
      handler(eventData.row);
    }));
  },

  columnFilterUpdated: function(event) {
    this.dataSource.applyFilter(event);
  }

});
TB.Table.include(TB.Events);
