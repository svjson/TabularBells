describe("Table", function() {

  it('throws exception if initialized without a view', function () {  
    expect(function() {
      new PJ.Table({});
    }).toThrow(new Error("No view specified."));
  });  

  it('accepts provided view in constructor', function() {
    var tableView = new PJ.TableView();
    expect(
      new PJ.Table({ view: tableView }).view
    ).toEqual(tableView);
  });
 
});
