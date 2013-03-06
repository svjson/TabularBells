/*! JSTABLE - v0.1.0 - 2013-03-06
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
    
  },

  selectPage: function(pageNumber) {

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

    this.target.find('.pgn-prev').on('click', this.proxy(function(e) {
      this.trigger('page-step', -1);
    }));

    this.target.find('.pgn-next').on('click', this.proxy(function(e) {
      this.trigger('page-step', 1);
    }));

    this.selectPage(paginationSpec.currentPage);
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
    this.maxPage = Math.ceil(dataSource.size() / this.pageSize);
    this.view.render({
      pageSize: this.pageSize,
      dataSetSize: dataSource.size(),
      pages: this.maxPage,
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
      this.selectPage(data.pageNumber);
    }));

    this.view.bind('page-step', this.proxy(function(data) {
      this.selectPage(this.currentPage + data);
    }));
  },

  selectPage: function(pageNumber) {
    if (pageNumber <= 0 || pageNumber > this.maxPage) return;
    this.currentPage = pageNumber;
    this.trigger('pagination-changed');
    this.view.selectPage(this.currentPage);
  },

  getPageQuery: function() {
    return { from: (this.currentPage-1) * this.pageSize,
	     size: this.pageSize };
  }

});

PJ.BasicColumnModel = new PJ.Class({

  showActions: function() {
    return this.actions != null && this.actions.length > 0;
  }
  
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

  rowTemplate: '{{each(i,row) data}}\
    <tr class="data-row">\
      {{each(idx,col) columnModel.columns}}\
        {{if !col.hidden}}\
          <td>${row[col.index]}</td>\
        {{/if}}\
      {{/each}}\
      {{if columnModel.showActions()}}\
        <td>\
          {{html layoutActions(columnModel, row)}}\
        </td>\
      {{/if}}\
    </tr>\
  {{/each}}',

  actionsTemplate: '{{each(idx,action) columnModel.actions}}\
      {{html actionFormatter(action)}}\
    {{/each}}',

  actionTemplate: '<a href="#" class="action-link" data-action-id="${action.id}">${action.label}</a>',

  layoutActions: function(columnModel, row) {
    var span = $('<span></span>');
    $(this.wrap(this.actionsTemplate)).tmpl({columnModel: columnModel, row: row, actionFormatter: this.proxy(this.actionFormatter)}).appendTo(span);
    return span.html();
  },

  actionFormatter: function(action) {    
    var span = $('<span></span>');
    $(this.wrap(this.actionTemplate)).tmpl({action: action}).appendTo(span);
    return span.html();
  },

  init: function() {
    
  },

  render: function(command) {
    $(this.wrap(this.tableTemplate)).tmpl().appendTo(this.target);
    command.columnModel.columns.forEach(this.proxy(function(column) {
      if (!column.hidden) {
	$(this.wrap(this.headerTemplate)).tmpl(column).appendTo(this.target.find('.header-row'));
      }
    }));
    if (command.data) {
      this.updateRows(command);
    }

    this.target.on('click', '.action-link', this.proxy(function(e) {
      e.preventDefault();
      var clicked = $(e.currentTarget);
      this.trigger('action-requested', { action: clicked.attr('data-action-id'),
					 row: (this.currentDataSet[clicked.closest('tr').index() - 1]) });
      return false;
    }));
  },
  
  updateRows: function(command) {
    this.currentDataSet = command.data;
    
    if (command.data.length == 0) {
      $(this.wrap(this.noContentRow)).tmpl().appendTo(this.target.find('table tbody'));
    } else {
      this.target.find('.no-content-row').remove();
      this.target.find('.data-row').remove();
      $(this.wrap(this.rowTemplate)).tmpl($.extend({ layoutActions: this.proxy(this.layoutActions)}, command)).appendTo(this.target.find('table tbody'));
    }
  },

  wrap: function(html) {
    return '<script>' + html + '</script>';
  }

});

PJ.JQueryTemplateView.include(PJ.Events);

/**
 * Table main class
 */
PJ.Table = new PJ.Class({
  
  view: null,

  dataSource: null,

  columnModel: null,

  paginationStrategy: new PJ.NoPagination(),

  init: function() {
    this.initialize();
  },
  
  initialize: function() {
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

PJ.BootstrapTable = PJ.Table.sub({

  init: function() {    
    this.view = new PJ.BootstrapTableTemplateView({
      target: this.tableElement,
      actionData: !this.actionData ? {} : this.actionData
    });

    this.paginationStrategy = new PJ.PaginationBar({
      view: new PJ.BootstrapPaginationTemplateView({
         target: this.paginationElement
      }),
      pageSize: this.pageSize
    });
    this.initialize();
  }

});

PJ.BootstrapTableTemplateView = PJ.JQueryTemplateView.sub({

  tableTemplate: '<table class="table table-condensed table-striped" cellpadding="0" cellspacing="0" width="100%"><tr class="header-row"> </tr> </table>',

  actionsTemplate: '<div class="actions"><ul style="list-style-type: none;">{{each(idx,action) columnModel.actions}}\
    {{html actionFormatter(action)}}\
  {{/each}}</ul></div>',

  actionData: {},

  actionTemplate: '<li style="display: inline"><a href="#" class="action-link" data-action-id="${action.id}"><i class="${actionData[action.id]} icon-large" title="${action.label}"></i></a></li>',

  actionFormatter: function(action) {
    var span = $('<span></span>');
    $(this.wrap(this.actionTemplate)).tmpl({action: action, actionData: this.actionData}).appendTo(span);
    return span.html();    
  }

});

PJ.BootstrapPaginationTemplateView = PJ.JQueryTemplatePaginationView.sub({

  paginationBarTemplate: '<div class="pagination-bar">\
      <div class="pagination pagination-centered">\
        <ul>\
          <li><a style="margin-left: 10px" href="#" class="pgn-prev" title="Previous Page">&laquo;</a></li>\
          {{each(idx,p) pages}} <li><a class="number pagination-page" href="#" data-page="${idx+1}">${idx+1}</a></li>{{/each}}\
          <li><a style="margin-right: 10px" href="#" class="pgn-next" title="Next Page">&raquo;</a></li>\
        </ul>\
     </div>\
   </div>',

  selectPage: function(pageNumber) {
    this.target.find('li').removeClass('active');
    this.target.find('a[data-page="' + pageNumber + '"]').parent('li').addClass('active');
  }

});
