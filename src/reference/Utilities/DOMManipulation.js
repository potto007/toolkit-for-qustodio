///////////////////////////////////////////////////////////////////////////////
//  File:	DOMManipulation.js
//  Project:	Qustodio Family Portal
//  Company:    Evolium
//  Author:     Francesco Carrella (francesco.carrella@evolium.com)
//  Created:    2011-02-21
///////////////////////////////////////////////////////////////////////////////

QFP.Utilities.DOMManipulation = (function() {
  return {
    getTotalWidth: function(el) {
      var totalWidth = el.width();
      totalWidth += parseInt(el.css('padding-left'), 10) + parseInt(el.css('padding-right'), 10); //Total Padding Width
      totalWidth += parseInt(el.css('margin-left'), 10) + parseInt(el.css('margin-right'), 10); //Total Margin Width
      totalWidth +=
        parseInt(el.css('borderLeftWidth'), 10) + parseInt(el.css('borderRightWidth'), 10); //Total Border Width
      return totalWidth;
    },

    makeEqualHeight: function(el, children_selector) {
      $(el).each(function() {
        var parent = $(this);
        var childrens = $(children_selector, parent);
        var max_height = 0;

        $.each(childrens, function(index, item) {
          var child = $(item);
          var child_height = child.height();
          if (child_height > max_height) {
            max_height = child_height;
          }
        });

        childrens.height(max_height);
      });
    },

    getFormValues: function(form) {
      var values = {};
      $.each(form.serializeArray(), function(i, field) {
        values[field.name] = field.value;
      });
      return values;
    },
  };
})();
