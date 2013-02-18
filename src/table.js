/**
 * Table main class
 */
PJ.Table = new PJ.Class({
  
  view: null,

  dataSource: null,

  init: function() {
    this.initializeView();
//    this.initializeDataSource();

    console.log('Creating new instance');
  },


  initializeView: function() {
    if (!this.view) {
      throw new Error("No view specified.");
    }
    this.view.initialize();
  },

  initializeDataSource: function() {
    this.dataSource.initialize();
  }

});
