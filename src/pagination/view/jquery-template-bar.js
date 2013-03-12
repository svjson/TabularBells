TB.JQueryTemplatePaginationView = TB.PaginationView.sub({

  paginationBarTemplate: '<div>{{each(idx,p) pages}} <a class="pagination-page" href="#" data-page="${idx+1}">[${idx+1}</a>] {{/each}}</div>',

  target: null,

  render: function(paginationSpec) {
    if (!this.target) return;
    this.target.html('');

    if (paginationSpec.pages > 1) {
      var pageArray = [];
      for (var i=0; i < paginationSpec.pages; i++) {
	pageArray.push(i);
      }
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

    this.selectPage(paginationSpec.currentPage);
  }

});
