describe('Action Event Interaction', function() {
  
  it('should be possible to bind action events to specific events directly', function() {
    
    var table = new TB.Table({
      view: new TB.TableView(),
      paginationStrategy: new TB.PaginationBar({ pageSize: 2}),
      columnModel: new TB.BasicColumnModel({
	columns: [{index: 'first', header: 'First'}],
	actions: [{id: 'open', header: 'Open'}]
      })
    });

    var actionInvoked = false;

    table.bindAction('open', function(rowData) {
      actionInvoked = true;
    });

    table.dataSource.loadData([{first: 'Bananas!'}, {first: 'Coconuts!'}]);

    table.view.invokeAction('open', 0);


    expect( actionInvoked ).toEqual( true );

  });

});
