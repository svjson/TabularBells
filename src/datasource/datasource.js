TB.DataSource = new TB.Class({

  data: [],

  filter: null,

  init: function() {

  },

  size: function(callback) {
    if (callback) {
      callback(this.data.length);
    }
    return this.data.length;
  },

  initialize: function(callback) {
    callback();
  },
  
  applyFilter: function(filter) {
    if (!this.filter) this.filter = {};
    if (!filter.filter || filter.filter.length == 0) {
      delete this.filter[filter.index];
    } else {
      this.filter[filter.index] = filter.filter;
    }
    this.filteredData = null;
    this.trigger('data-changed', this.data);
  },

  getFilteredData: function() {
    if (null == this.filteredData) {
      this.filterData();
    }
    return this.filteredData;
  },

  filterData: function() {
    var filtered = [];
    this.data.forEach(this.proxy(function(row) {
      if (this.matchesFilter(row)) filtered.push(row);
    }));
    this.filteredData = filtered;
  },

  matchesFilter: function(row) {
    for (var filterIndex in this.filter) {
      var field = filterIndex;
      var filter = this.filter[filterIndex];

      if (!row[field]) return false;

      var filterL = filter.toLowerCase();
      var valueL = row[field].toLowerCase();
      if (valueL.indexOf(filterL) == -1) return false;
    }
    return true;
  },

  isFilterActive: function() {
    if (!this.filter) return false;
    for (var i in this.filter) { return true; }
    return false;
  }

  

});
TB.DataSource.include(TB.Events);
