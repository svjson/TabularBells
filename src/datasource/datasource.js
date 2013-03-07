TB.DataSource = new TB.Class({

  data: [],

  size: function(callback) {
    if (callback) {
      callback(this.data.length);
    }
    return this.data.length;
  },

  initialize: function() {
    
  }
  
});
TB.DataSource.include(TB.Events);
