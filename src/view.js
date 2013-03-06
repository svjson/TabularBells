
TB.TableView = new TB.Class({
  
  init: function() {
    console.log('init TableView');
  },

  initialize: function(columnModel) {
    this.render({
      columnModel: columnModel,
      data: []
    });
  },
  
  render: function(command) {

  },

  updateRows: function(data) {

  }

});
