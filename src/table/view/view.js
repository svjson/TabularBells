
TB.TableView = new TB.Class({

  currentDataSet: [],
  
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

  invokeAction: function(actionId, rowIndex) {
    this.trigger('action-requested', { action: actionId,
				       row: this.currentDataSet[rowIndex] });
  }

});

TB.TableView.include(TB.Events);
