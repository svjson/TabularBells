describe("PaginationBar", function() {

  it('should return pageQuery for first page when currentPage is 1', function() {
    var paginationBar = new TB.PaginationBar();
    expect(paginationBar.getPageQuery()).toEqual( { from: 0, size: 20 });
  });
  
});
