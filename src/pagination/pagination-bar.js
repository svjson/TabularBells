
PJ.PaginationBar = PJ.PaginationStrategy.sub({

  getPageQuery: function() {
    return { from: (this.currentPage-1) * this.pageSize,
	     size: this.pageSize };
  }

});
