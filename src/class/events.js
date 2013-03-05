PJ.Events = function() {
  return {
    listeners: {},

    trigger: function(eventType, eventData) {
      this.getHandlers(eventType).forEach(function(fn) {
	fn(eventData);
      });
    },
    
    bind: function(eventType, handlerFn) {
      this.getHandlers(eventType).push(handlerFn);
    },
    
    getHandlers: function(eventType) {
      if (!this.listeners[eventType]) {
	this.listeners[eventType] = [];
      }
      return this.listeners[eventType];
    }
  };
};
  
