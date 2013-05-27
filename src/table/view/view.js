
TB.TableView = new TB.Class({

  currentDataSet: [],

  selectionMode: 'none',

  selectedRowClass: 'selected',
  
  init: function() {

  },

  initialize: function(columnModel) {
    this.render({
      columnModel: columnModel,
      data: []
    });
  },
  
  render: function(command) {
    
  },

  showLoadingStatus: function() {
    
  },

  updateRows: function(command) {
    this.currentDataSet = command.data;;
  },

  isSelectionEnabled: function() {
    return this.selectionMode && this.selectionMode !== 'none';
  },

  invokeAction: function(actionId, rowIndex) {
    this.trigger('action-requested', { action: actionId,
				       row: this.currentDataSet[rowIndex] });
  },

  rowSelected: function(row, rowIndex) {
    this.trigger('row-selected', { row: this.currentDataSet[rowIndex] });	
  }

});

TB.TableView.include(TB.Events);
