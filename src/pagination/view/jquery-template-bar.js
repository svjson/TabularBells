PJ.JQueryTemplatePaginationView = PJ.PaginationView.sub({

  paginationBarTemplate: '<div>{{each(idx,p) pages}} <a class="pagination-page" href="#" data-page="${idx+1}">[${idx+1}</a>] {{/each}}</div>',

  target: null,

  render: function(paginationSpec) {
    $(this.paginationBarTemplate).tmpl({pages: new Array(paginationSpec.pages)}).appendTo(this.target);

    this.target.find('.pagination-page').on('click', this.proxy(function(e) {
      var page = parseInt($(e.currentTarget).attr('data-page'));
      this.trigger('page-requested', {pageNumber: page});
    }));
  }

});

// PJ.JQueryTemplatePaginationView.include(PJ.Events);
