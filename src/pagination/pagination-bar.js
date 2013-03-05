
PJ.PaginationBar = PJ.PaginationStrategy.sub({

  init: function() {
    this.view.bind('page-requested', this.proxy(function(data) {
      this.currentPage = data.pageNumber;
      this.trigger('pagination-changed');
    }));
  },

  getPageQuery: function() {
    return { from: (this.currentPage-1) * this.pageSize,
	     size: this.pageSize };
  }

});
