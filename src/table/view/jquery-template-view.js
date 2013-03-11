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

    this.target.on('click', '.action-link', this.proxy(function(e) {
      e.preventDefault();
      var clicked = $(e.currentTarget);

      var actionId = clicked.attr('data-action-id');
      var rowIndex = clicked.closest('tr').index() - 1;

      this.invokeAction(actionId, rowIndex);

      return false;
    }));

    this.bindColumnFilterPopovers(command);
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

  bindColumnFilterPopovers: function(command) {
    alert('ColumnFilter is not implemented in this view implementation');
  },

  wrap: function(html) {
    return '<script>' + html + '</script>';
  }

});

