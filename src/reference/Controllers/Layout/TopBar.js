///////////////////////////////////////////////////////////////////////////////
//  File:  AlertBox.js
//  Project:   Qustodio Family Portal
//  Company:    Qustodio
//  Author:     Marçal Machado Chaiben (marcal.chaiben@qustodio.com)
//  Created:    2013-06-11
///////////////////////////////////////////////////////////////////////////////

QFP.Controllers.Layout.TopBar = (function() {
  function close(el) {
    var key = el.attr('id');
    el.slideUp('fast');
    if (key) {
      $.ajax({
        url: '/account-setup/save-settings',
        type: 'POST',
        data: {
          option: 'hide_top_bar',
          key: key,
        },
        error: function() {
          releaseGenericSaveError();
        },
      });
    }
  }

  function removeHide(key) {
    if (key) {
      $.ajax({
        url: '/account-setup/save-settings',
        type: 'POST',
        data: {
          option: 'remove_hide_top_bar',
          key: key,
        },
        error: function() {
          releaseGenericSaveError();
        },
        success: function() {
          $('#' + key).trigger('show');
        },
      });
    }
  }

  function isHide(el) {
    var key = el.attr('id');
    if (key) {
      $.ajax({
        url: '/account-setup/check-settings',
        type: 'POST',
        data: {
          option: 'hide_top_bar',
          key: key,
        },
        success: function(value) {
          if (!value.result) {
            el.trigger('show');
          }
        },
        error: function() {
          return false;
        },
      });
    }
  }

  return {
    close: close,
    isHide: isHide,
    removeHide: removeHide,
  };
})();
