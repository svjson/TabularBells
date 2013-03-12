TB.ArrayDataSource = TB.DataSource.sub({

  init: function(data) {
    if (data) {
      this.data = data;
      this.cachedSize = data.length;
    }
  },

  size: function(callback) {
    var data = this.data;
    if (this.isFilterActive()) {
      data = this.getFilteredData();
    }

    if (callback) {
      callback(data.length);
    }
    return data.length;
  },

  get: function(query, callback) {
    var data = this.data;
    if (this.isFilterActive()) {
      data = this.getFilteredData();
    }

    if (query.from > data.length) return [];
    if (!query.size) return data;
    var startAt = query.from;
    var endAt = query.from + query.size;
    if (endAt > data.length) endAt = data.length;
    if (callback) {
      callback(data.slice(startAt, endAt));
    }
    return data.slice(startAt, endAt);
  },
 
  loadData: function(data, meta) {
    this.data = data;
    this.cachedSize = data.length;

    if (meta) {
      if (meta.total) {
	this.cachedSize = meta.total;
      }
    } 

    this.trigger('data-changed', data);
  }
  
});
TB.DataSource.include(TB.Events);
