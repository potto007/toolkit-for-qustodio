QFP.Controllers.Layout = (function() {
  function init() {
    QFP.Controllers.Layout.UserSwitcher.init();
    QFP.Controllers.Layout.Premium.init();
    QFP.Controllers.Layout.ContactUs.init();
    QFP.Controllers.Layout.AlertBox.init();

    if (
      (QFP.Utilities.Routing.Client.get()['show'] == 'tour' ||
        !QFP.Run.ViewData.TourAlreadyShown) &&
      QFP.Run.ViewData.ProfileDevicesCount
    ) {
      QFP.Controllers.Layout.Tour.show(null, {
        listeners: {
          onStop: function() {
            QFP.Controllers.Layout.Notifications.getAll();
          },
        },
      });
      if (QFP.Run.ViewName != 'index.index') {
        window.location.hash = '';
      }
    } else {
      QFP.Controllers.Layout.Notifications.getAll();
    }
  }

  return {
    init: init,
  };
})();

$(QFP.Controllers.Layout.init);
