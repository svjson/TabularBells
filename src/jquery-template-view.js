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
