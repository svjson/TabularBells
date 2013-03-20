/*! TabularBells - v0.0.5-SNAPSHOT - 2013-03-20
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

  filter: null,

  init: function() {

  },

  size: function(callback) {
    if (callback) {
      callback(this.data.length);
    }
    return this.data.length;
  },

  initialize: function(callback) {
    callback();
  },
  
  applyFilter: function(filter) {
    if (!this.filter) this.filter = {};
    if (!filter.filter || filter.filter.length == 0) {
      delete this.filter[filter.index];
    } else {
      this.filter[filter.index] = filter.filter;
    }
    this.filteredData = null;
    this.trigger('data-changed', this.data);
  },

  getFilteredData: function() {
    if (null == this.filteredData) {
      this.filterData();
    }
    return this.filteredData;
  },

  filterData: function() {
    var filtered = [];
    this.data.forEach(this.proxy(function(row) {
      if (this.matchesFilter(row)) filtered.push(row);
    }));
    this.filteredData = filtered;
  },

  matchesFilter: function(row) {
    for (var filterIndex in this.filter) {
      var field = filterIndex;
      var filter = this.filter[filterIndex];

      if (!row[field]) return false;

      var filterL = filter.toLowerCase();
      var valueL = row[field].toLowerCase();
      if (valueL.indexOf(filterL) == -1) return false;
    }
    return true;
  },

  isFilterActive: function() {
    if (!this.filter) return false;
    for (var i in this.filter) { return true; }
    return false;
  }

  

});
TB.DataSource.include(TB.Events);

TB.ArrayDataSource = TB.DataSource.sub({

  init: function(data) {
    if (data) {
      this.data = data;
      this.cachedSize = data.length;
    }
  },

  size: function(callback) {
    var data = this.data;
    if (this.isFilterActive()) {
      data = this.getFilteredData();
    }

    if (callback) {
      callback(data.length);
    }
    return data.length;
  },

  get: function(query, callback) {
    var data = this.data;
    if (this.isFilterActive()) {
      data = this.getFilteredData();
    }

    if (query.from > data.length) return [];
    if (!query.size) return data;
    var startAt = query.from;
    var endAt = query.from + query.size;
    if (endAt > data.length) endAt = data.length;
    if (callback) {
      callback(data.slice(startAt, endAt));
    }
    return data.slice(startAt, endAt);
  },
 
  loadData: function(data, meta) {
    this.data = data;
    this.cachedSize = data.length;

    if (meta) {
      if (meta.total) {
	this.cachedSize = meta.total;
      }
    } 

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
    
    var requestURI = this.baseUrl + '?page=' + (query.page) + '&pageSize=' + query.size;
    if (this.isFilterActive()) {
      requestURI += '&filter=' + JSON.stringify(this.filter);
    }

    $.getJSON(requestURI, this.proxy(function(json) {
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
	this.cachedSize = this.dataSetSize;
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

  pageArray: [], 

  render: function(paginationSpec) {
    if (!this.target) return;
    this.target.html('');

    if (paginationSpec.pages > 1) {
      var pageArray = [];
      for (var i=0; i < paginationSpec.pages; i++) {
	pageArray.push(i);
      }
      this.pageArray = pageArray;
      var tmplObj = {pages: pageArray};
      $(this.paginationBarTemplate).tmpl(tmplObj).appendTo(this.target);
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

    this.target.find('.pgn-first').on('click', this.proxy(function(e) {
      e.preventDefault();
      this.trigger('page-requested', {pageNumber: 1});
      return false;
    }));

    this.target.find('.pgn-last').on('click', this.proxy(function(e) {
      e.preventDefault();
      this.trigger('page-requested', {pageNumber: this.pageArray.length});
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

TB.ResultView = new TB.Class({

  textTemplate: 'Showing results ${first} - ${last} of ${total}',

  update: function(pageQuery, data, total) {
    var templateData = {
      first: pageQuery.from + 1,
      last: pageQuery.from + data.length,
      total: total
    };
    var text = this.renderTemplate(templateData);
    if (templateData.total == 0) {
      text = '';
    }

    this.updateUI(text);
  },

  updateUI: function(text) {
    
  },

  renderTemplate: function(data) {
    var rendered = this.textTemplate;
    
    var placeholders = [];
    
    var next = '${';

    var placeholder = {};
    for (var i=0; i<this.textTemplate.length; i++) {
      if (this.textTemplate.substring(i,i+next.length) == next) {
	if (next == '${') {
	  placeholder.start = i;
	  next= '}';
	} else if (next == '}') {
	  placeholder.end = i;
	  placeholder.name = this.textTemplate.substring(placeholder.start+2, i);
	  placeholders.push(placeholder);
	  placeholder = {};
	  next = '${';
	}
      }
    }

    placeholders.forEach(function(ph) {
      rendered = rendered.replace('${' + ph.name + '}', data[ph.name]);
    });
    return rendered;
  }

});

TB.JQueryTemplateResultView = TB.ResultView.sub({

  resultTemplate: '<div><div style="text-align: center">{{html text}}</div></div>',

  updateUI: function(text) {
    if (this.target) {
      this.target.html($(this.resultTemplate).tmpl({text: text}));
    }
  }

});

TB.BasicColumnModel = new TB.Class({

  actionsHeader: 'Actions',

  init: function() {
    this.columns.forEach(function(col) {
      if (col.columnFilter === true) {
	col.columnFilter = {
	  direction: 'top',
	  title: 'Column filter'
	};
      }
    });
  },

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
  },

  getColumnByIndex: function(index) {
    for (idx in this.columns) {
      if (this.columns[idx].index == index) return this.columns[idx];
    }
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

  headerTemplate: '<th data-index="${index}">{{html header}}</th>',

  filterTemplate: '<small> (<a href="#" class="filter-trigger">filter</a>)</small>',

  noContentRow: '<tr class="no-content-row"><td colspan="${noofColumns}">{{html noDataTemplate}}</td></tr>',

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

  columnFilterTemplate: '<div id="column-popup-wrapper"><div id="column-popup"><input class="column-filter-input" data-column-index="${index}" type="text" /></div></div>',

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
	var header = column.header;
	if (column.columnFilter) {
	  header += this.filterTemplate;
	}
	$(this.wrap(this.headerTemplate)).tmpl({header: header, index: column.index}).appendTo(this.target.find('.header-row'));
      }
    }));
    if (command.columnModel.showActions()) {
      $(this.wrap(this.headerTemplate)).tmpl({header: command.columnModel.actionsHeader}).appendTo(this.target.find('.header-row'));
    }
    if (command.data) {
      this.updateRows(command);
    } 

    var actionHandlerFn = this.proxy(function(e) {
      e.preventDefault();
      var clicked = $(e.currentTarget);

      var actionId = clicked.attr('data-action-id');
      var rowIndex = clicked.closest('tr').index() - 1;

      this.invokeAction(actionId, rowIndex);

      return false;
    });

    this.target.find('.action-link').on('click', actionHandlerFn);


    this.bindColumnFilterPopovers(command);
  },
  
  updateRows: function(command) {
    this.currentDataSet = command.data;

    if (command.data.length == 0) {
      this.showNoContentStatus();
    } else {
      this.target.find('.no-content-row').remove();
      this.target.find('.data-row').remove();
      var templateData = $.extend({ layoutActions: this.proxy(this.layoutActions)}, command);
      $(this.wrap(this.rowTemplate)).tmpl(templateData).appendTo(this.target.find('table tbody'));
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

  bindColumnFilterPopovers: function(command) {
    alert('ColumnFilter is not implemented in this view implementation');
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

  resultView: new TB.ResultView(),

  init: function() {
    this.initialize();
  },
  
  initialize: function() {
    this.initializeDataSource(this.proxy(function() {
      this.initializeView();
      this.initializePagination();

      this.paginationStrategy.bind('pagination-changed', this.proxy(this.refreshTable));
      this.dataSource.bind('data-changed', this.proxy(this.initializePagination));
      this.dataSource.bind('data-changed', this.proxy(this.refreshTable));
      this.dataSource.bind('loading-initiated', this.proxy(this.showLoadingStatus));

      this.view.bind('column-filter-updated', this.proxy(this.columnFilterUpdated));
    }));
  },

  refreshTable: function() {
    var pageQuery = this.paginationStrategy.getPageQuery();
    this.dataSource.get(pageQuery, this.proxy(function(data) {
      this.view.updateRows({
        data: data,
        columnModel: this.columnModel
      });      
      this.resultView.update(pageQuery, data, this.dataSource.cachedSize);
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
  },

  columnFilterUpdated: function(event) {
//    console.log('Column ' + event.index + ' now has filter ' + event.filter);
    this.dataSource.applyFilter(event);
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

    if (this.resultElement) {
      this.resultView = new TB.JQueryTemplateResultView({
	target: this.resultElement,
	textTemplate: this.resultTextTemplate || TB.ResultView.fn.textTemplate
      });
    }

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

  filterTemplate: '<a href="#" rel="popover" class="filter-trigger"><i class="icon-large icon-filter" /></a>',

  actionData: {},

  actionTemplate: '<li style="display: inline"><a href="#" class="action-link" data-action-id="${action.id}"><i class="${actionData[action.id]} icon-large" title="${action.label}"></i></a></li>',

  columnFilterTemplate: '<div id="column-popup-wrapper"><div id="column-popup"><input style="max-width: 195px" class="column-filter-input" data-table-id="${tableId}" data-column-index="${index}" type="text" /></div></div>',


  actionFormatter: function(action) {
    var span = $('<span></span>');
    $(this.wrap(this.actionTemplate)).tmpl({action: action, actionData: this.actionData}).appendTo(span);
    return span.html();    
  },

  bindColumnFilterPopovers: function(command) {
    
    var triggers = this.target.find('th .filter-trigger');

    triggers.each(this.proxy(function(i,trigger) {
      trigger = $(trigger);
      
      var dataIndex = trigger.closest('th').attr('data-index');
      var filterConfig = command.columnModel.getColumnByIndex(dataIndex).columnFilter;

      trigger.popover({
	title: filterConfig.title,
	placement: filterConfig.direction,
	content: $(this.columnFilterTemplate).tmpl({tableId: this.target.attr('id'), index: dataIndex}),
	html: true
      }); 
      trigger.click(function(e) {
	e.preventDefault();
	return false;
      });

    }));
    
    $(document).on('keyup', '.column-filter-input[data-table-id="' + this.target.attr('id') + '"]', this.proxy(function(e) {
      var target = $(e.currentTarget);
      var index = target.attr('data-column-index');
      var value = target.val();
      this.trigger('column-filter-updated', {
	index: index,
	filter: value
      });
    }));
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
