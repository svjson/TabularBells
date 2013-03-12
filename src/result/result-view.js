TB.ResultView = new TB.Class({

  textTemplate: 'Showing results ${first} - ${last} of ${total}',

  update: function(pageQuery, data, total) {
    var templateData = {
      first: pageQuery.from + 1,
      last: pageQuery.from + data.length,
      total: total
    };
    var text = this.renderTemplate(templateData);
    if (templateData.total == 0) {
      text = '';
    }

    this.updateUI(text);
  },

  updateUI: function(text) {
    
  },

  renderTemplate: function(data) {
    var rendered = this.textTemplate;
    
    var placeholders = [];
    
    var next = '${';

    var placeholder = {};
    for (var i=0; i<this.textTemplate.length; i++) {
      if (this.textTemplate.substring(i,i+next.length) == next) {
	if (next == '${') {
	  placeholder.start = i;
	  next= '}';
	} else if (next == '}') {
	  placeholder.end = i;
	  placeholder.name = this.textTemplate.substring(placeholder.start+2, i);
	  placeholders.push(placeholder);
	  placeholder = {};
	  next = '${';
	}
      }
    }

    placeholders.forEach(function(ph) {
      rendered = rendered.replace('${' + ph.name + '}', data[ph.name]);
    });
    return rendered;
  }

});
