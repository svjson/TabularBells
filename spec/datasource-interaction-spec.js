describe('DataSource Interaction', function() {
  
  it('should revert to last page when new dataset is smaller and current page number is too high', function() {
    var table = new TB.Table({
      view: new TB.TableView(),
      paginationStrategy: new TB.PaginationBar({ pageSize: 2 }),
      columnModel: new TB.BasicColumnModel({
	columns: [{index: 'first', header: 'First'}]
      })
    });

    table.dataSource.loadData([{ first: '#1' }, { first: '#2' }, { first: '#3' }, { first: '#4' }]);

    expect( table.paginationStrategy.maxPage ).toEqual(2);
    
    table.paginationStrategy.selectPage(2);
    expect( table.paginationStrategy.currentPage ).toEqual(2);

    table.dataSource.loadData([{ first: 'A' }, { first: 'B' }]);

    expect( table.paginationStrategy.maxPage ).toEqual(1);
    expect( table.paginationStrategy.currentPage ).toEqual(1);
  });

});
