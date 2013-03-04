PJ.ArrayDataSource = PJ.DataSource.sub({

  data: [],

  init: function(data) {
    if (data) {
      this.data = data;
    }
  },

  size: function() {
    return this.data.length;
  },

  get: function(query) {
    if (query.from > this.data.length) return [];
    var startAt = query.from;
    var endAt = query.from + query.size;
    if (endAt > this.data.length) endAt = this.data.length;
    return this.data.slice(startAt, endAt);
  }
  
});
