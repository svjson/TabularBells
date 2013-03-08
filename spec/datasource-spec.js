describe("DataSource", function() {

  it('should be able to add filter to empty filter object', function() {
    var ds = new TB.DataSource();
    
    ds.applyFilter({
      index: 'mycolumn',
      filter: 'bananas'
    });

    expect(ds.filter).toEqual({mycolumn: 'bananas'});    
  });

  it('should be able to add filter to existing filter object', function() {
    var ds = new TB.DataSource({
      filter: {
	mycolumn: 'bananas'
      }
    });

    ds.applyFilter({
      index: 'othercolumn',
      filter: 'kangaroo!'
    });

    expect(ds.filter).toEqual({
      mycolumn: 'bananas',
      othercolumn: 'kangaroo!'
    });
  });

  it('should be able to delete filter from existing filter object', function() {
    var ds = new TB.DataSource({
      filter: {
	mycolumn: 'bananas',
	othercolumn: 'kangaroo!'
      }
    });

    ds.applyFilter({
      index: 'mycolumn',
      filter: ''
    });
    
    expect(ds.filter).toEqual({
      othercolumn: 'kangaroo!'
    });
    
  });

  it('matchesFilter should return positive for exact match', function() {
    var ds = new TB.DataSource({
      filter: {
	name: 'Peter Pan'
      }
    });

    expect(ds.matchesFilter({name: 'Peter Pan'})).toEqual(true);
  });

  it('should respond negative to isFilterActive when no filter is present', function() {
    var ds = new TB.DataSource();
    expect(ds.isFilterActive()).toEqual(false);
  });

  it('should respond positive to isFilterActive when filter is present', function() {
    var ds = new TB.DataSource({ filter: { myfield: 'cheese' }});
    expect(ds.isFilterActive()).toEqual(true);
  });

});
