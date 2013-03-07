TB.DataSource = new TB.Class({

  data: [],

  size: function(callback) {
    if (callback) {
      callback(this.data.length);
    }
    return this.data.length;
  },

  initialize: function(callback) {
    callback();
  }
  
});
TB.DataSource.include(TB.Events);
