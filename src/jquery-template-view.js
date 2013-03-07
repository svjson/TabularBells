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
      this.trigger('action-requested', { action: clicked.attr('data-action-id'),
					 row: (this.currentDataSet[clicked.closest('tr').index() - 1]) });
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

TB.JQueryTemplateView.include(TB.Events);
