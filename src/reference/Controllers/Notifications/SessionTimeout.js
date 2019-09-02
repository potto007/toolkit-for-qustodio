QFP.Controllers.Layout.Notifications.Controllers.SessionTimeout = (function() {
  var notification, reset_link;

  function init() {
    notification = $('#SessionTimeout');
    reset_link = $('a.reset-timeout', notification);

    reset_link.click(function() {
      QFP.Controllers.Layout.Notifications.hide(notification);

      $.ajax({
        url: '/account-auth/ajax',
        type: 'POST',
        data: {
          option: 'reset_expiration_time',
        },
        success: function(new_expiration_time) {
          QFP.Controllers.Layout.SessionTimeout.setRemainingTime(new_expiration_time);
        },
      });

      return false;
    });
  }

  return {
    init: init,
  };
})();
