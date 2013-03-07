describe('Ajax DataSource', function() {

  it('should be possible to get value from object structure using helper method', function() {
    var ds = new TB.AjaxDataSource();

    var value = ds.getValueAtObjectPath('result.data.values', { result: { data: { values: [1, 2, 3] } } });
    
    expect(value).toEqual([1, 2, 3]);
  });

});
