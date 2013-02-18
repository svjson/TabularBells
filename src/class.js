var PJ = PJ || {};

/**
 * Minimal Class-library to support table components
 */
PJ.Class = (function() {
  var klass = function() {
    for (var prop in arguments[0]) {
      this[prop] = arguments[0][prop];
    }
    this.init.apply(this, arguments);
  };

  klass.prototype.init = function() {};

  klass.sub = function(obj) {
    var subbed = obj.subbed;
    for (var member in obj) {
      klass.prototype[member] = obj[member];
    }
    if (subbed) subbed(klass);
    return klass;
  };

  return klass;
})();
