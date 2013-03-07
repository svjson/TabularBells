
TB.NoPagination = TB.PaginationStrategy.sub({

  maxResults: 50,
  
  getPageQuery: function() {
    return {from: 0, page: 1};
  }
  
});
