QFP.Widgets.Extend = function(newProps) {
  return function(options) {
    return QFP.Utilities.BaseView(newProps, options, {
      render: function() {
        var templateHtml = $(this.template).html();
        var viewObj = $.extend({}, this.viewObj, this.getViewObj());
        var rendered = Mustache.render(templateHtml, viewObj);
        $(this.target).html(rendered);
      },
    });
  };
};
