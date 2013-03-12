TB.JQueryTemplateResultView = TB.ResultView.sub({

  resultTemplate: '<div><div style="text-align: center">{{html text}}</div></div>',

  updateUI: function(text) {
    if (this.target) {
      this.target.html($(this.resultTemplate).tmpl({text: text}));
    }
  }

});
