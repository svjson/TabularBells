
PJ.PaginationBar = PJ.PaginationStrategy.sub({

  init: function() {
    this.view.bind('page-requested', this.proxy(function(data) {
      this.selectPage(data.pageNumber);
    }));

    this.view.bind('page-step', this.proxy(function(data) {
      this.selectPage(this.currentPage + data);
    }));
  },

  selectPage: function(pageNumber) {
    if (pageNumber <= 0 || pageNumber > this.maxPage) return;
    this.currentPage = pageNumber;
    this.trigger('pagination-changed');
    this.view.selectPage(this.currentPage);
  },

  getPageQuery: function() {
    return { from: (this.currentPage-1) * this.pageSize,
	     size: this.pageSize };
  }

});
