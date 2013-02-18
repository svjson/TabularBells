/*! JSTABLE - v0.1.0 - 2013-02-18
* http://PROJECT_WEBSITE/
* Copyright (c) 2013 YOUR_NAME; Licensed MIT */

var PJ = PJ || {};

/**
 * Minimal Class-library to support table components
 */
PJ.Class = (function() {
  var klass = function() {
    for (var prop in arguments[0]) {
      this[prop] = arguments[0][prop];
    }
    this.init.apply(this, arguments);
  };

  klass.prototype.init = function() {};

  klass.sub = function(obj) {
    var subbed = obj.subbed;
    for (var member in obj) {
      klass.prototype[member] = obj[member];
    }
    if (subbed) subbed(klass);
    return klass;
  };

  return klass;
})();

PJ.DataSource = PJ.Class.sub({
  
});


PJ.TableView = PJ.Class.sub({
  
  initialize: function() {
    
  }

});

PJ.JQueryTableView = PJ.TableView.sub({

});

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
