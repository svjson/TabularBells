TB.BasicColumnModel = new TB.Class({

  renderCell: function(row, columnIndex) {
    var col = this.columns[columnIndex];
    if (col.renderFn) {
      return col.renderFn(row[col.index], row);
    }
    return row[col.index];
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
  }
  
});
