QFP.Controllers.Layout.Notifications.Controllers.AccountValidation = (function() {
  var notification, resend_link;

  function init() {
    notification = $('#AccountValidation');
    resend_link = $("a:not('.close_button')", notification);
    resend_link.click(function() {
      $.ajax({
        url: '/account-auth/ajax',
        type: 'POST',
        data: {
          option: 'send_validation_mail',
        },
        success: function() {
          QFP.Controllers.Layout.Notifications.hide(notification);
          QFP.Controllers.Layout.Notifications.show('_strNotifConfirmationEmailResended');
        },
      });
      return false;
    });
  }

  return {
    init: init,
  };
})();
