
PJ.NoPagination = PJ.PaginationStrategy.sub({

  maxResults: 50,
  
  getPageQuery: function() {
    return {from: 0};
  }
  
});
