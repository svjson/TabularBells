TB.BasicColumnModel = new TB.Class({

  actionsHeader: 'Actions',

  init: function() {
    this.columns.forEach(function(col) {
      if (col.columnFilter === true) {
	col.columnFilter = {
	  direction: 'top',
	  title: 'Column filter'
	};
      }
    });
  },

  renderCell: function(row, columnIndex) {
    var col = this.columns[columnIndex];
    if (col.renderFn) {
      return col.renderFn(row[col.index], row);
    }
    return row[col.index] != null ? row[col.index] : '';
  },

  showActions: function() {
    return this.actions != null && this.actions.length > 0;
  },
  
  visibleColumns: function() {
    var cols = 0;
    this.columns.forEach(function(col) {
      if (!col.hidden) cols++;
    });
    if (this.showActions()) cols++;
    return cols;
  },

  getColumnByIndex: function(index) {
    for (idx in this.columns) {
      if (this.columns[idx].index == index) return this.columns[idx];
    }
  }
  
});
