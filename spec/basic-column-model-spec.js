describe("BasicColumnModel", function() {
  
  it('should transform columnFilter:true to default columnFilter-settings', function() {
    
    var columnModel = new TB.BasicColumnModel({
      columns: [
	{ index: 'name', header: 'Name', columnFilter: true },
	{ index: 'age', header: 'Age' }
      ]
    });
    
    expect(columnModel.columns[0].columnFilter).toEqual({
      direction: 'top',
      title: 'Column filter'
    });

  });

});
