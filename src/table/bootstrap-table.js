TB.BootstrapTable = TB.Table.sub({

  init: function() {    
    this.view = new TB.BootstrapTableTemplateView({
      target: this.tableElement,
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
