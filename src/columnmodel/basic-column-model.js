TB.BasicColumnModel = new TB.Class({

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
