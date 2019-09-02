///////////////////////////////////////////////////////////////////////////////
//  File:       Classification.js
//  Project:    Qustodio Family Portal
//  Company:    Evolium
//  Author:     Francesco Carrella (francesco.carrella@gmail.com)
//  Created:    2011-02-21
///////////////////////////////////////////////////////////////////////////////

QFP.Modules.CategoriesSelector = function(categories_array) {
  var config = {
    dom_selector: '#categories_list',
  };
  var dom_el;

  function init() {
    //$.extend(config, default_config, options);	// Merge options with default values

    dom_el = $(config.dom_selector);

    for (var i in categories_array) {
      if (categories_array.hasOwnProperty(i)) {
        addCategory(categories_array[i]);
      }
    }
  }

  function addCategory(settings) {
    var category_el = QFP.Utilities.Templates.render('categories_selector_el', settings);
    dom_el.append(category_el);

    var hyperElement = new QFP.Modules.HyperElement($('.name', category_el), {
      actions: [],
    });
  }

  init();
};
