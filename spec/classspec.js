describe("Class", function() {

  it("should be possible to call functions on class instance", function() {
    var Person = new PJ.Class({
      greeting: function() {
	return "hello!";      
      }
    });

    var p = new Person();

    expect(p.greeting()).toEqual("hello!");
  });

  it("should be possible to pass argument object to constructor", function() {
    var Person = new PJ.Class({
      init: function(args) {
	this.name = args.name;
      },
      greeting: function() {
	return this.name + ' says "hello!"';
      }
    });

    var p = new Person({name: 'Montezuma'});

    expect(p.greeting()).toEqual('Montezuma says "hello!"');   
  });

  it("should be possible to extend a class and inherit a function", function() {
    var Person = new PJ.Class({
      init: function(args) {
	this.greeting = args.greeting;
      },
      sayHello: function() {
	return this.greeting;
      }
    });

    var Montezuma = Person.sub({
      
    });

    var m = new Montezuma({greeting: 'Howdy!'});

    expect(m.sayHello()).toEqual('Howdy!');
  });

  it("should add all constructor object arguments as members to instance", function() {
    
    var Person = new PJ.Class({});
    
    var p = new Person({ field: 'value', fruit: 'banana'});

    expect(p.field).toEqual('value');
    expect(p.fruit).toEqual('banana');

  });
  
  it("should be possible to use the proxy-function to retain class scope in closures", function() {
    
    var Person = new PJ.Class({
      firstName: null,

      lastName: null,
      
      fullName: function() {
	return this.proxy(function() {
	  return this.firstName + ' ' + this.lastName;
	})();
      }
    });

    var p = new Person({
      firstName: 'Roberta',
      lastName: 'Sparrow'
    });

    expect(p.fullName()).toEqual('Roberta Sparrow');

  });
     
});
