///////////////////////////////////////////////////////////////////////////////
//  File:  AlertBox.js
//  Project:   Qustodio Family Portal
//  Company:    Qustodio
//  Author:     Marçal Machado Chaiben (marcal.chaiben@qustodio.com)
//  Created:    2013-06-11
///////////////////////////////////////////////////////////////////////////////

QFP.Controllers.Layout.AlertBox = (function() {
  function init() {
    $('.alert_box').each(function() {
      var $el = $(this),
        $close_el = $('.close_btn', $el);
      $close_el.bind('click', function() {
        close($el);
      });
    });
  }

  function close(el) {
    var alert_key = el.attr('id'),
      alert_id = alert_key.split(':')[0],
      user_id = alert_key.split(':')[1];

    el.slideUp();
    if (alert_id) {
      $.ajax({
        url: '/account-setup/save-settings',
        type: 'POST',
        data: {
          option: 'hide_alert_box',
          alert_key: alert_key,
          alert_id: alert_id,
          user_id: user_id,
        },
        error: function() {
          releaseGenericSaveError();
        },
      });
    }
  }

  return {
    init: init,
  };
})();
