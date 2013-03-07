/*! TabularBells - v0.0.2 - 2013-03-07
* http://www.github.com/svjson/TabularBells/
* Copyright (c) 2013 Sven Johansson; Licensed MIT */

var TabularBells = TabularBells || {};
var TB = TB || TabularBells;

TB.Class = function(specObj) {
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
    return new TB.Class(extendedObj);
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

TB.Events = function() {
  return {
    listeners: null,

    trigger: function(eventType, eventData) {
      this.getHandlers(eventType).forEach(function(fn) {
	fn(eventData);
      });
    },
    
    bind: function(eventType, handlerFn) {
      this.getHandlers(eventType).push(handlerFn);
    },
    
    getHandlers: function(eventType) {
      this.listeners = this.listeners || {};
      if (!this.listeners[eventType]) {
	this.listeners[eventType] = [];
      }
      return this.listeners[eventType];
    }
  };
};
  

TB.DataSource = new TB.Class({

  data: [],

  size: function(callback) {
    if (callback) {
      callback(this.data.length);
    }
    return this.data.length;
  },

  initialize: function(callback) {
    callback();
  }
  
});
TB.DataSource.include(TB.Events);

TB.ArrayDataSource = TB.DataSource.sub({

  init: function(data) {
    if (data) {
      this.data = data;
    }
  },

  get: function(query, callback) {
    if (query.from > this.data.length) return [];
    if (!query.size) return this.data;
    var startAt = query.from;
    var endAt = query.from + query.size;
    if (endAt > this.data.length) endAt = this.data.length;
    if (callback) {
      callback(this.data.slice(startAt, endAt));
    }
    return this.data.slice(startAt, endAt);
  },
  
  loadData: function(data) {
    this.data = data;
    this.trigger('data-changed', data);
  }
  
});
TB.DataSource.include(TB.Events);

TB.AjaxDataSource = TB.DataSource.sub({

  data: [],

  baseUrl: null,

  pageParameter: 'page',

  pageSizeParameter: 'pageSize',

  dataSetSize: null,

  dataPath: 'data',
  
  sizePath: 'size',
  
  init: function() {    
    
  },

  initialize: function(callback) {
    this.size(this.proxy(function() {
      callback();
    }));
  },

  get: function(query, callback) {
    this.trigger('loading-initiated');
    $.getJSON(this.baseUrl + '?page=' + (query.page) + '&pageSize=' + query.size, this.proxy(function(json) {
      this.dataSetSize = this.getValueAtObjectPath(this.sizePath, json);
      callback(this.getValueAtObjectPath(this.dataPath, json));
    }));
  },

  getValueAtObjectPath: function(path, obj) {
    var o = obj;
    path.split('.').forEach(function(pathPart) {
      o = o[pathPart];
    });
    return o;
  },

  size: function(callback) {
    if (this.dataSetSize) {
      callback(this.dataSetSize);
    } else {
      this.get({from: 1, page: 1, size: 1}, this.proxy(function() {
	callback(this.dataSetSize);
      }));
    }
  }

});


TB.PaginationView = new TB.Class({

  render: function(paginationSpec) {
    
  },

  selectPage: function(pageNumber) {

  }

});

TB.PaginationView.include(TB.Events);

TB.NoPaginationView = TB.PaginationView.sub({

});

TB.JQueryTemplatePaginationView = TB.PaginationView.sub({

  paginationBarTemplate: '<div>{{each(idx,p) pages}} <a class="pagination-page" href="#" data-page="${idx+1}">[${idx+1}</a>] {{/each}}</div>',

  target: null,

  render: function(paginationSpec) {
    this.target.html('');

    if (paginationSpec.pages > 1) {
      $(this.paginationBarTemplate).tmpl({pages: new Array(paginationSpec.pages)}).appendTo(this.target);
    }

    this.target.find('.pagination-page').on('click', this.proxy(function(e) {
      e.preventDefault();
      var page = parseInt($(e.currentTarget).attr('data-page'));
      this.trigger('page-requested', {pageNumber: page});
      return false;
    }));

    this.target.find('.pgn-prev').on('click', this.proxy(function(e) {
      e.preventDefault();
      this.trigger('page-step', -1);
      return false;
    }));

    this.target.find('.pgn-next').on('click', this.proxy(function(e) {
      e.preventDefault();
      this.trigger('page-step', 1);
      return false;
    }));

    this.selectPage(paginationSpec.currentPage);
  }

});

/**
 * Abstract pagination spec
 */
TB.PaginationStrategy = new TB.Class({

  pageSize: 20,

  currentPage: 1,

  view: new TB.NoPaginationView(),
 
  initialize: function(dataSource) {    
    dataSource.size(this.proxy(function(dataSetSize) {
      this.maxPage = Math.ceil(dataSetSize / this.pageSize);
      if (this.currentPage > this.maxPage) this.currentPage = this.maxPage;
      if (this.currentPage == 0) this.currentPage = 1;
      this.view.render({
	pageSize: this.pageSize,
	dataSetSize: dataSetSize,
	pages: this.maxPage,
	currentPage: this.currentPage
      });
    }));
  }

});
TB.PaginationStrategy.include(TB.Events);


TB.NoPagination = TB.PaginationStrategy.sub({

  maxResults: 50,
  
  getPageQuery: function() {
    return {from: 0, page: 1};
  }
  
});


TB.PaginationBar = TB.PaginationStrategy.sub({

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
	     page: this.currentPage,
	     size: this.pageSize };
  }

});

TB.BasicColumnModel = new TB.Class({

  renderCell: function(row, columnIndex) {
    var col = this.columns[columnIndex];
    if (col.renderFn) {
      return col.renderFn(row[col.index], row);
    }
    return row[col.index];
  },

  showActions: function() {
    return this.actions != null && this.actions.length > 0;
  },
  
  visibleColumns: function() {
    var cols = 0;
    this.columns.forEach(function(col) {
      if (!col.hidden) cols++;
    });
    if (this.showActions()) cols++;
    return cols;
  }
  
});


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

TB.JQueryTemplateView = TB.TableView.sub({
  
  target: null,

  tableTemplate: '<table><tr class="header-row"></tr></table>',

  noDataTemplate: 'No content',
  loadingTemplate: 'Loading...',

  noContentRow: '<tr class="no-content-row"><td colspan="${noofColumns}">{{html noDataTemplate}}</td></tr>',

  headerTemplate: '<th>${header}</th>',

  rowTemplate: '{{each(i,row) data}}\
    <tr class="data-row">\
      {{each(idx,col) columnModel.columns}}\
        {{if !col.hidden}}\
          <td>{{html columnModel.renderCell(row, idx)}}</td>\
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
    
    this.numberOfColumns = command.columnModel.visibleColumns();

    $(this.wrap(this.tableTemplate)).tmpl().appendTo(this.target);
    command.columnModel.columns.forEach(this.proxy(function(column) {
      if (!column.hidden) {
	$(this.wrap(this.headerTemplate)).tmpl(column).appendTo(this.target.find('.header-row'));
      }
    }));
    if (command.columnModel.showActions()) {
      $(this.wrap(this.headerTemplate)).tmpl({header: 'Actions'}).appendTo(this.target.find('.header-row'));
    }
    if (command.data) {
      this.updateRows(command);
    }

    this.target.on('click', '.action-link', this.proxy(function(e) {
      e.preventDefault();
      var clicked = $(e.currentTarget);

      var actionId = clicked.attr('data-action-id');
      var rowIndex = clicked.closest('tr').index() - 1;

      this.invokeAction(actionId, rowIndex);

      return false;
    }));
  },
  
  updateRows: function(command) {
    this.currentDataSet = command.data;
    
    if (command.data.length == 0) {
      this.showNoContentStatus();
    } else {
      this.target.find('.no-content-row').remove();
      this.target.find('.data-row').remove();
      $(this.wrap(this.rowTemplate)).tmpl($.extend({ layoutActions: this.proxy(this.layoutActions)}, command)).appendTo(this.target.find('table tbody'));
    }
  },
  
  showNoContentStatus: function() {
    this.showEmptyStatus(this.noDataTemplate);
  },

  showLoadingStatus: function() {
    this.showEmptyStatus(this.loadingTemplate);
  },

  showEmptyStatus: function(rowTemplate) {
      this.target.find('.no-content-row').remove();
      this.target.find('.data-row').remove();
      $(this.wrap(this.noContentRow)).tmpl({noofColumns: this.numberOfColumns,
					    noDataTemplate: rowTemplate}).appendTo(this.target.find('table tbody'));
  },

  wrap: function(html) {
    return '<script>' + html + '</script>';
  }

});


/**
 * Table main class
 */
TB.Table = new TB.Class({
  
  view: null,

  dataSource: null,

  columnModel: null,

  paginationStrategy: new TB.NoPagination(),

  init: function() {
    this.initialize();
  },
  
  initialize: function() {
    this.initializeDataSource(this.proxy(function() {
      console.log('DataSource done');
      this.initializeView();
      console.log('View done');
      this.initializePagination();
      console.log('Pagination done');

      this.paginationStrategy.bind('pagination-changed', this.proxy(this.refreshTable));
      this.dataSource.bind('data-changed', this.proxy(this.initializePagination));
      this.dataSource.bind('data-changed', this.proxy(this.refreshTable));
      this.dataSource.bind('loading-initiated', this.proxy(this.showLoadingStatus));
    }));
  },

  refreshTable: function() {
    this.dataSource.get(this.paginationStrategy.getPageQuery(), this.proxy(function(data) {
       this.view.updateRows({
         data: data,
         columnModel: this.columnModel
       });
    }));
  },

  showLoadingStatus: function() {
    this.view.showLoadingStatus();
  },

  initializeView: function() {
    if (!this.view) {
      throw new Error("No view specified.");
    }
    this.view.initialize(this.columnModel);
    this.refreshTable();
  },

  initializeDataSource: function(callback) {
    if (!this.dataSource) {
      this.dataSource = new TB.ArrayDataSource([]);
    }
    this.dataSource.initialize(callback);
  },

  initializePagination: function() {
    this.paginationStrategy.initialize(this.dataSource);
  },

  bindAction: function(actionId, handler) {
    this.view.bind('action-requested', this.proxy(function(eventData) {
      if (eventData.action === actionId) {
	handler(eventData.row);
      }
    }));
  }

});
TB.Table.include(TB.Events);

TB.BootstrapTable = TB.Table.sub({

  init: function() {    
    this.view = new TB.BootstrapTableTemplateView({
      target: this.tableElement,
      noDataTemplate: !this.noDataTemplate ? 'No content' : this.noDataTemplate,
      loadingTemplate: !this.loadingTemplate ? 'Loading...' : this.loadingTemplate,
      actionData: !this.actionData ? {} : this.actionData
    });

    this.paginationStrategy = new TB.PaginationBar({
      view: new TB.BootstrapPaginationTemplateView({
         target: this.paginationElement
      }),
      pageSize: this.pageSize
    });
    this.initialize();
  }

});

TB.BootstrapTableTemplateView = TB.JQueryTemplateView.sub({

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

TB.BootstrapPaginationTemplateView = TB.JQueryTemplatePaginationView.sub({

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