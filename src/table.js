/**
 * Table main class
 */
PJ.Table = PJ.Class.sub({
  
  view: null,

  dataSource: null,

  init: function(config) {
    if (!config.view) {
      throw "No view specified.";
    }

    view.initialize();

    console.log('Creating new instance');
  }
});
