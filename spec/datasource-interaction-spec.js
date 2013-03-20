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

  it('should correctly display last page when dataset size exactly fills X number of pages', function() {
    var lastTableCommand = {};
    
    var DummyView = TB.TableView.sub({
      updateRows: function(command) {
	lastTableCommand = command;
      }
    });

    var table = new TB.Table({
      view: new DummyView(),
      paginationStrategy: new TB.PaginationBar({ pageSize: 2 }),
      columnModel: new TB.BasicColumnModel({
	columns: [{index: 'first', header: 'First'}]
      })      
    });

    table.dataSource.loadData([{ first: '#1' }, { first: '#2' }, { first: '#3' }, { first: '#4' }, { first: '#5' }, { first: '#6' }]);

    expect( table.paginationStrategy.maxPage ).toEqual(3);
    
    table.paginationStrategy.selectPage(3);

    expect( lastTableCommand.data ).toEqual([{ first: '#5' }, { first: '#6' }]);
    
  });


});
