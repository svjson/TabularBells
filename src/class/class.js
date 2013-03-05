var PJ = PJ || {};

PJ.Class = function(specObj) {
  var klass = function(obj) {    
    for (var prop in obj) {
      this[prop] = obj[prop];
    }
    this.init.apply(this, arguments);
    
  };
  klass.prototype.init = function() {};
  
  klass.fn = klass.prototype;

  klass.fn.proxy = function(fn) {
    var self = this;
    return function() {
      return fn.apply(self, arguments);
    };
  };

  klass.sub = function(obj) {
    
  };

  klass.sub = function(obj) {
    var extendedObj = {};
    for (var prop in this.fn) {
      extendedObj[prop] = this.fn[prop];
    }
    for (var prop in obj) {
      extendedObj[prop] = obj[prop];
    }
    return new PJ.Class(extendedObj);
  };

  klass.include = function(obj) {
    if (typeof(obj) == 'function') {
      obj = obj();
    }
    for (var prop in obj) {
      klass.fn[prop] = obj[prop];
    }
  };

  if (specObj) {
    klass.include(specObj);
  }
  
  return klass;
};
