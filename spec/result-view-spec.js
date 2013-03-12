describe("ResultView", function() {

  it('should replace placeholders in result string template', function() {
    
    var view = new TB.ResultView({
      textTemplate: 'Showing ${first} - ${last} of ${total}'
    });

    var data = {
      first: 1,
      last: 19,
      total: 63
    };

    expect( view.renderTemplate(data) ).toEqual('Showing 1 - 19 of 63');

  });

});
