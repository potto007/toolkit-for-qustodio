QFP.Controllers.Layout.Premium = (function() {
  var modal_config = {
    width: 835,
    height: 500,
  };

  function init() {
    if (
      QFP.Run.ViewData.License &&
      (QFP.Run.ViewData.License.type == 'LICENSE_FREE' || QFP.Run.ViewData.License.trial)
    ) {
      var free_banner = $('#account_info .account_banner');

      free_banner
        .css({
          cursor: 'pointer',
        })
        .on({
          mouseenter: function() {
            free_banner.addClass('hover');
          },
          mouseleave: function() {
            free_banner.removeClass('hover');
          },
          click: function() {
            QFP.Controllers.Layout.Premium.showOffer(QFP.Run.ViewName, 'badge');
          },
        });
    }
    if (
      QFP.Run.ViewData.License &&
      (QFP.Run.ViewData.License.type == 'LICENSE_PREMIUM' &&
        QFP.Run.ViewData.License.days_to_expire <= 30 &&
        QFP.Run.ViewData.License.days_to_expire != false)
    ) {
      var renew_banner = $('#account_info .account_banner');

      renew_banner
        .css({
          cursor: 'pointer',
        })
        .on({
          mouseenter: function() {
            renew_banner.addClass('hover');
          },
          mouseleave: function() {
            renew_banner.removeClass('hover');
          },
          click: function() {
            QFP.Controllers.Layout.Premium.showOffer(QFP.Run.ViewName, 'badge');
          },
        });
    }
  }

  function showOffer(view, context) {
    // Force modal showing
    showModal(view, context);

    // For free users we want to have an A/B test
    // if (QFP.Run.ViewData.License && QFP.Run.ViewData.License.type == 'LICENSE_FREE' && QFP.Run.ViewData.Locale == "pt_BR") {

    //     var variant = $.cookie('qpce');
    //     if (!variant) {
    //         variant = Math.floor((Math.random() * 2) + 1);
    //         $.cookie('qpce', variant, {
    //             expires: 365,
    //             path: '/'
    //         });
    //     }

    //     showModal(view, context, variant);
    // }
    // else {
    //     showModal(view, context);
    // }

    // only show the landing page to FREE user's DISABLED
    //        if (QFP.Run.ViewData.License && QFP.Run.ViewData.License.type == 'LICENSE_FREE') {
    //          showPage(view, context);
    //        } else {
    //            showModal(view, context);
    //        }
  }

  function showModal(view, context, variant) {
    var variant = variant == undefined ? 1 : variant;

    switch (QFP.Run.ViewData.License ? QFP.Run.ViewData.License.type : 'LICENSE_FREE') {
      case 'LICENSE_FREE':
        // var offer_path = (variant == 1)? '/popup/premium-generic' : '/popup/premium-generic-b';
        var offer_path = '/popup/premium-generic';
        break;

      case 'LICENSE_PREMIUM':
        if (QFP.Run.ViewData.License.trial) {
          offer_path = '/popup/premium-trial';
        } else {
          offer_path = '/popup/premium-ending';
        }
        break;

      default:
        return false;
    }

    if (view && typeof view == 'string') {
      var regexp = new RegExp(/[^a-z^A-Z^0-9-]/g);
      view = view.replace(regexp, '-');
      offer_path = offer_path + '?view=' + view;
    }

    if (context && typeof context == 'string') {
      var regexp = new RegExp(/[^a-z^A-Z^0-9-]/g);
      context = context.replace(regexp, '-');
      offer_path = offer_path + '&context=' + context;
    }

    if (QFP.Run.ViewData.Locale && typeof QFP.Run.ViewData.Locale == 'string') {
      offer_path = offer_path + '&locale=' + QFP.Run.ViewData.Locale;
    }

    var o = $.extend(
      {
        href: offer_path,
      },
      modal_config
    );

    QFP.Controllers.Layout.Notifications.showPopup(o);
  }

  function showGenericModal(view, context, page_path, user_modal_config) {
    if (view && typeof view == 'string') {
      var regexp = new RegExp(/[^a-z^A-Z^0-9-]/g);
      view = view.replace(regexp, '-');
      page_path = page_path + '?view=' + view;
    }

    if (context && typeof context == 'string') {
      var regexp = new RegExp(/[^a-z^A-Z^0-9-]/g);
      context = context.replace(regexp, '-');
      page_path = page_path + '&context=' + context;
    }

    if (QFP.Run.ViewData.Locale && typeof QFP.Run.ViewData.Locale == 'string') {
      page_path = page_path + '&locale=' + QFP.Run.ViewData.Locale;
    }

    var o = $.extend(
      {
        href: page_path,
      },
      user_modal_config != undefined ? user_modal_config : modal_config
    );

    QFP.Controllers.Layout.Notifications.showPopup(o);
  }

  function showPage(view, context) {
    var page_path = '/account-setup/premium-offer/';

    if (view && typeof view == 'string') {
      var regexp = new RegExp(/[^a-z^A-Z^0-9-]/g);
      view = view.replace(regexp, '-');
      page_path = page_path + '?view=' + view;
    }

    if (context && typeof context == 'string') {
      var regexp = new RegExp(/[^a-z^A-Z^0-9-]/g);
      context = context.replace(regexp, '-');
      page_path = page_path + '&context=' + context;
    }

    if (QFP.Run.ViewData.Locale && typeof QFP.Run.ViewData.Locale == 'string') {
      page_path = page_path + '&locale=' + QFP.Run.ViewData.Locale;
    }

    window.location.href = page_path;
  }

  return {
    init: init,
    showOffer: showOffer,
    showGenericModal: showGenericModal,
  };
})();
