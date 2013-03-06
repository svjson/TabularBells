PJ.JQueryTemplateView = PJ.TableView.sub({
  
  target: null,

  tableTemplate: '<table><tr class="header-row"></tr></table>',

  noContentRow: '<tr class="no-content-row"><td>No content</td></tr>',

  headerTemplate: '<th>${header}</th>',

  rowTemplate: '{{each(i,row) data}}\
    <tr class="data-row">\
      {{each(idx,col) columnModel.columns}}\
        <td>${row[col.index]}</td>\
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
    $(this.wrap(this.headerTemplate)).tmpl(command.columnModel.columns).appendTo(this.target.find('.header-row'));
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
