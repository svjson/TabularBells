describe("ArrayDataSource", function() {

  it('should return size 0 and an empty array when it has no data', function() {
    expect( new TB.ArrayDataSource().size() ).toEqual(0);
    expect( new TB.ArrayDataSource().get({from: 0, size: 20})).toEqual([]);
  });

  it('should return correct size and array data when present', function() {
    var dataSource = new TB.ArrayDataSource([1, 2, 3, 4, 5, 6, 7]);

    expect( dataSource.size() ).toEqual(7);
    expect( dataSource.get({from: 0, size: 7}) ).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('should return correct all elements if size-argument is larger than data length', function() {
    var dataSource = new TB.ArrayDataSource([1, 2, 3, 4, 5, 6, 7]);
    
    expect( dataSource.get({from: 0, size: 20}) ).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('should return sub-array if data length is larger than size-argument', function() {
    var dataSource = new TB.ArrayDataSource([1, 2, 3, 4, 5, 6, 7]);
    
    expect( dataSource.get({from: 0, size: 5}) ).toEqual([1, 2, 3, 4, 5]);
    expect( dataSource.get({from: 5, size: 5}) ).toEqual([6, 7]);
  });

  it('should return subset when filter is active', function() {
    var dataSource = new TB.ArrayDataSource([
      {name: 'Anders'},
      {name: 'Benny'},
      {name: 'Berit'},
      {name: 'Clyde'},
      {name: 'Dennis'}
    ]);

    expect( dataSource.get({from: 0, size: 5}) ).toEqual([
      {name: 'Anders'},
      {name: 'Benny'},
      {name: 'Berit'},
      {name: 'Clyde'},
      {name: 'Dennis'}
    ]);

    dataSource.applyFilter({
      index: 'name',
      filter: 'Be'
    });

    expect( dataSource.get({from: 0, size: 5}) ).toEqual([
      {name: 'Benny'},
      {name: 'Berit'}
    ]);
    
  });

});

