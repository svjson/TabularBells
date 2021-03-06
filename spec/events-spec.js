describe("Events", function() {
  
  it('should be possible to use a class instance as event bus when Events is included', function() {
    
    var Thingummybob = new TB.Class();
    Thingummybob.include(TB.Events);

    var t = new Thingummybob();
    
    var payload = null;

    t.bind('data-received', function(data) {
      payload = data;
    });
    t.trigger('data-received', { value: 'abc' });

    expect(payload).toEqual( { value: 'abc' });
  });

});
