/*! JSTABLE - v0.1.0 - 2013-02-18
* http://PROJECT_WEBSITE/
* Copyright (c) 2013 YOUR_NAME; Licensed MIT */

var PJ = PJ || {};

PJ.Class = function(specObj) {
  var klass = function(obj) {    
    for (var prop in obj) {
      this[prop] = obj[prop];
    }
    this.init.apply(this, arguments);
  };
  klass.prototype.init = function() {};
  
  klass.fn = klass.prototype;

  klass.sub = function(obj) {
    
  };

  klass.sub = function(obj) {
    var extendedObj = {};
    for (var prop in this.fn) {
      extendedObj[prop] = this.fn[prop];
    }
    for (var prop in obj) {
      extendedObj[prop] = obj[prop];
    }
    return new PJ.Class(extendedObj);
  };

  klass.include = function(obj) {
    for (var prop in obj) {
      klass.fn[prop] = obj[prop];
    }
  };

  if (specObj) {
    klass.include(specObj);
  }
  
  return klass;
};

PJ.DataSource = new PJ.Class({

  initialize: function() {

  }
  
});


PJ.TableView = new PJ.Class({
  
  init: function() {
    console.log('init TableView');
  },

  initialize: function() {
    
  }

});

PJ.JQueryTableView = PJ.TableView.sub({

});

/**
 * Table main class
 */
PJ.Table = new PJ.Class({
  
  view: null,

  dataSource: null,

  init: function() {
    this.initializeView();
    this.initializeDataSource();

    console.log('Creating new instance');
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
