TB.ArrayDataSource = TB.DataSource.sub({

  init: function(data) {
    if (data) {
      this.data = data;
    }
  },

  get: function(query, callback) {
    if (query.from > this.data.length) return [];
    if (!query.size) return this.data;
    var startAt = query.from;
    var endAt = query.from + query.size;
    if (endAt > this.data.length) endAt = this.data.length;
    if (callback) {
      callback(this.data.slice(startAt, endAt));
    }
    return this.data.slice(startAt, endAt);
  },
  
  loadData: function(data) {
    this.data = data;
    this.trigger('data-changed', data);
  }
  
});
TB.DataSource.include(TB.Events);
