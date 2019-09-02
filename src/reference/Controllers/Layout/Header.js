QFP.Controllers.Layout.Header = (function() {
  function init(tenant = 'family') {
    var $header = $('#new_header'),
      $header_user_btn = $header.find('.js-header-user-btn'),
      $header_user_menu = $header.find('.js-header-user-menu'),
      $header_notifications_btn = $header.find('.js-notifications-btn'),
      $header_notification_link = $header.find('.js-notification-link'),
      $header_notification_count = $header.find('.js-notification-count'),
      $header_notifications_list = $header.find('.js-notifications-list'),
      $header_upgrade_link = $header.find('.js-upgrade-link');

    $header_user_btn.on('click', function() {
      $header_user_menu.toggle();
      $header_user_btn.toggleClass('active');
    });

    $('#logout_button').on('click', function() {
      // We clear the localStorage to logout the user from the PAR-Web
      window.localStorage.clear();
    });

    $(document).mouseup(function(e) {
      var clicked_on_btn =
          !$header_user_btn.is(e.target) && $header_user_btn.has(e.target).length === 0,
        clicked_on_menu =
          !$header_user_menu.is(e.target) && $header_user_menu.has(e.target).length === 0;

      if (clicked_on_btn && clicked_on_menu) {
        $header_user_menu.hide();
        $header_user_btn.removeClass('active');
      }
    });

    $header_upgrade_link.on('click', function() {
      if (tenant === 'family') {
        let path = '/account-setup/premium-offer-two/';
        path += '?view=' + QFP.Run.ViewName.replace(new RegExp(/[^a-z^A-Z^0-9-]/g), '-');
        path += '&context=upgrade-button';
        path += '&locale=' + QFP.Run.ViewData.Locale;
        window.location.href = path;
      } else {
        QFP.Controllers.Layout.Premium.showOffer(QFP.Run.ViewName, 'upgrade-button');
      }
    });
  }

  return {
    init: init,
  };
})();
