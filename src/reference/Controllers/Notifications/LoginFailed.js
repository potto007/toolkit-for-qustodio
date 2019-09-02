QFP.Controllers.Layout.Notifications.Controllers.LoginFailed = (function() {
  var notification, reset_link;

  function init() {
    notification = $('#LoginFailed');
    notification.show();
    contactus_link = $('a.contact-us', notification);

    contactus_link.click(function() {
      QFP.Controllers.Layout.Notifications.hide(notification);

      QFP.Controllers.Layout.ContactUs.show();

      return false;
    });
  }

  return {
    init: init,
  };
})();
