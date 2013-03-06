describe("Table", function() {

  it('throws exception if initialized without a view', function () {  
    expect(function() {
      new TB.Table({});
    }).toThrow(new Error("No view specified."));
  });  

  it('accepts provided view in constructor', function() {
    var tableView = new TB.TableView();
    expect(
      new TB.Table({ view: tableView }).view
    ).toEqual(tableView);
  });
 
});
