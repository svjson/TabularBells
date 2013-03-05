/*! JSTABLE - v0.1.0 - 2013-03-05
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

  klass.fn.proxy = function(fn) {
    var self = this;
    return function() {
      return fn.apply(self, arguments);
    };
  };

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
    if (typeof(obj) == 'function') {
      obj = obj();
    }
    for (var prop in obj) {
      klass.fn[prop] = obj[prop];
    }
  };

  if (specObj) {
    klass.include(specObj);
  }
  
  return klass;
};

PJ.Events = function() {
  return {
    listeners: {},

    trigger: function(eventType, eventData) {
      this.getHandlers(eventType).forEach(function(fn) {
	fn(eventData);
      });
    },
    
    bind: function(eventType, handlerFn) {
      this.getHandlers(eventType).push(handlerFn);
    },
    
    getHandlers: function(eventType) {
      if (!this.listeners[eventType]) {
	this.listeners[eventType] = [];
      }
      return this.listeners[eventType];
    }
  };
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
    if (!query.size) return this.data;
    var startAt = query.from;
    var endAt = query.from + query.size;
    if (endAt > this.data.length) endAt = this.data.length;
    return this.data.slice(startAt, endAt);
  }
  
});

PJ.PaginationView = new PJ.Class({

  render: function(paginationSpec) {
    
  }

});

PJ.PaginationView.include(PJ.Events);

PJ.NoPaginationView = PJ.PaginationView.sub({

});

PJ.JQueryTemplatePaginationView = PJ.PaginationView.sub({

  paginationBarTemplate: '<div>{{each(idx,p) pages}} <a class="pagination-page" href="#" data-page="${idx+1}">[${idx+1}</a>] {{/each}}</div>',

  target: null,

  render: function(paginationSpec) {
    $(this.paginationBarTemplate).tmpl({pages: new Array(paginationSpec.pages)}).appendTo(this.target);

    this.target.find('.pagination-page').on('click', this.proxy(function(e) {
      var page = parseInt($(e.currentTarget).attr('data-page'));
      this.trigger('page-requested', {pageNumber: page});
    }));
  }

});

// PJ.JQueryTemplatePaginationView.include(PJ.Events);

/**
 * Abstract pagination spec
 */
PJ.PaginationStrategy = new PJ.Class({

  pageSize: 20,

  currentPage: 1,

  view: new PJ.NoPaginationView(),
 
  initialize: function(dataSource) {    
    this.view.render({
      pageSize: this.pageSize,
      dataSetSize: dataSource.size(),
      pages: Math.ceil(dataSource.size() / this.pageSize),
      currentPage: 1
    });
  }

});
PJ.PaginationStrategy.include(PJ.Events);


PJ.NoPagination = PJ.PaginationStrategy.sub({

  maxResults: 50,
  
  getPageQuery: function() {
    return {from: 0};
  }
  
});


PJ.PaginationBar = PJ.PaginationStrategy.sub({

  init: function() {
    this.view.bind('page-requested', this.proxy(function(data) {
      this.currentPage = data.pageNumber;
      this.trigger('pagination-changed');
    }));
  },

  getPageQuery: function() {
    return { from: (this.currentPage-1) * this.pageSize,
	     size: this.pageSize };
  }

});

PJ.BasicColumnModel = new PJ.Class({
  
});


PJ.TableView = new PJ.Class({
  
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

PJ.JQueryTemplateView = PJ.TableView.sub({
  
  target: null,

  tableTemplate: '<table><tr class="header-row"></tr></table>',

  noContentRow: '<tr class="no-content-row"><td>No content</td></tr>',

  headerTemplate: '<th>${header}</th>',

  rowTemplate: '{{each(i,row) data}}<tr class="data-row">{{each(idx,col) columnModel.columns}}<td>${row[col.index]}</td>{{/each}}</tr>{{/each}}',

  init: function() {
    
  },

  render: function(command) {
    $(this.wrap(this.tableTemplate)).tmpl().appendTo(this.target);
    $(this.wrap(this.headerTemplate)).tmpl(command.columnModel.columns).appendTo(this.target.find('.header-row'));
    if (command.data) {
      this.updateRows(command);
    }
  },
  
  updateRows: function(command) {
    if (command.data.length == 0) {
      $(this.wrap(this.noContentRow)).tmpl().appendTo(this.target.find('table tbody'));
    } else {
      this.target.find('.no-content-row').remove();
      this.target.find('.data-row').remove();
      $(this.wrap(this.rowTemplate)).tmpl(command).appendTo(this.target.find('table tbody'));
    }
  },

  wrap: function(html) {
    return '<script>' + html + '</script>';
  }

});

/**
 * Table main class
 */
PJ.Table = new PJ.Class({
  
  view: null,

  dataSource: null,

  columnModel: null,

  paginationStrategy: new PJ.NoPagination(),

  init: function() {
    this.initializeDataSource();
    this.initializeView();
    this.initializePagination();

    this.paginationStrategy.bind('pagination-changed', this.proxy(this.refreshTable));
  },

  refreshTable: function() {
    this.view.updateRows({
      data: this.dataSource.get(this.paginationStrategy.getPageQuery()),
      columnModel: this.columnModel
    });
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
      this.dataSource = new PJ.ArrayDataSource({data: []});
    }
    this.dataSource.initialize();
  },

  initializePagination: function() {
    this.paginationStrategy.initialize(this.dataSource);
  }

});
