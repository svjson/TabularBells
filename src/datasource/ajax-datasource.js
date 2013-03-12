TB.AjaxDataSource = TB.DataSource.sub({

  data: [],

  baseUrl: null,

  pageParameter: 'page',

  pageSizeParameter: 'pageSize',

  dataSetSize: null,

  dataPath: 'data',
  
  sizePath: 'size',
  
  init: function() {    
    
  },

  initialize: function(callback) {
    this.size(this.proxy(function() {
      callback();
    }));
  },

  get: function(query, callback) {
    this.trigger('loading-initiated');
    
    var requestURI = this.baseUrl + '?page=' + (query.page) + '&pageSize=' + query.size;
    if (this.isFilterActive()) {
      requestURI += '&filter=' + JSON.stringify(this.filter);
    }

    $.getJSON(requestURI, this.proxy(function(json) {
      this.dataSetSize = this.getValueAtObjectPath(this.sizePath, json);
      callback(this.getValueAtObjectPath(this.dataPath, json));
    }));
  },

  getValueAtObjectPath: function(path, obj) {
    var o = obj;
    path.split('.').forEach(function(pathPart) {
      o = o[pathPart];
    });
    return o;
  },

  size: function(callback) {
    if (this.dataSetSize) {
      callback(this.dataSetSize);
    } else {
      this.get({from: 1, page: 1, size: 1}, this.proxy(function() {
	this.cachedSize = this.dataSetSize;
	callback(this.dataSetSize);
      }));
    }
  }

});

