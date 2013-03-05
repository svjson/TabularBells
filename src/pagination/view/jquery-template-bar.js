PJ.JQueryTemplatePaginationView = PJ.PaginationView.sub({

  paginationBarTemplate: '<div>{{each(idx,p) pages}} [${idx+1}] {{/each}}</div>',

  target: null,

  render: function(paginationSpec) {
    $(this.paginationBarTemplate).tmpl({pages: new Array(paginationSpec.pages)}).appendTo(this.target);
  }

});
