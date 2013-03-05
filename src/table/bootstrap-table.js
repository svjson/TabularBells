PJ.BootstrapTable = PJ.Table.sub({

  init: function() {    
    this.view = new PJ.BootstrapTableTemplateView({
      target: this.tableElement
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

  tableTemplate: '<table class="table table-condensed table-striped" cellpadding="0" cellspacing="0" width="100%"><tr class="header-row"> </tr> </table>'

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
