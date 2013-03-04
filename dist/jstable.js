/*! JSTABLE - v0.1.0 - 2013-03-04
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

PJ.ArrayDataSource = PJ.DataSource.sub({

  data: [],

  init: function(data) {
    if (data) {
      this.data = data;
    }
  },

  size: function() {
    return this.data.length;
  },

  get: function(query) {
    if (query.from > this.data.length) return [];
    var startAt = query.from;
    var endAt = query.from + query.size;
    if (endAt > this.data.length) endAt = this.data.length;
    return this.data.slice(startAt, endAt);
  }
  
});


PJ.TableView = new PJ.Class({
  
  init: function() {
    console.log('init TableView');
  },

  initialize: function() {
    this.render();
  },
  
  render: function() {

  }

});

PJ.JQueryTemplateView = PJ.TableView.sub({
  
  target: null,

  tableTemplate: '<table><tr><td>No content</td></tr></table>',

  rowTemplate: '<tr><td>hej</td></tr>',

  init: function() {
    
  },

  render: function() {
    this.target.append($(this.tableTemplate).tmpl());
  }

});

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
