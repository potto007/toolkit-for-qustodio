///////////////////////////////////////////////////////////////////////////////
//  File:	UIDecorations.js
//  Project:	Qustodio Family Portal
//  Company:    Evolium
//  Author:     Francesco Carrella (francesco.carrella@evolium.com)
//  Created:    2011-03-14
///////////////////////////////////////////////////////////////////////////////

QFP.Utilities.UIDecorations = (function() {
  return {
    equalColumnsHeight: function() {
      $('.columns-container').each(function() {
        var columns = $(this).children('.column'),
          max_height = 0;
        columns.css('min-height', '');
        columns.each(function() {
          var column_height = $(this).height();
          if (column_height > max_height) {
            max_height = column_height;
          }
        });
        columns.css('min-height', max_height);
      });
    },

    iPhoneStyleCheckboxes: function() {
      $(':checkbox.iphone_style').iphoneStyle({
        resizeContainer: false,
        handleWidth: 32,
        checkedLabel: QFP.lng('_strYes'),
        uncheckedLabel: QFP.lng('_strNo'),
      });
      $(':checkbox.iphone_style_blocked')
        .iphoneStyle({
          resizeContainer: false,
          handleWidth: 32,
          checkedLabel: QFP.lng('_strYes'),
          uncheckedLabel: QFP.lng('_strNo'),
        })
        .parent()
        .css({
          opacity: 0.5,
        });
      $(':checkbox.iphone_onoff_style').iphoneStyle({
        resizeContainer: false,
        handleWidth: 32,
        checkedLabel: QFP.lng('_strOn'),
        uncheckedLabel: QFP.lng('_strOff'),
      });
    },
  };
})();
