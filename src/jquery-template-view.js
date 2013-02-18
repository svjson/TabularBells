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
