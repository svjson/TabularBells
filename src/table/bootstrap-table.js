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
