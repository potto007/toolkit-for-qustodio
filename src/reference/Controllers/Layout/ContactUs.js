QFP.Controllers.Layout.ContactUs = (function() {
  function init() {
    $body = $('body');
    initLinks($body);
  }

  function initLinks($el) {
    var $contact_us_links = $('.contact-us', $el);

    $contact_us_links.on('click', show);

    return $contact_us_links;
  }

  function show() {
    if (
      QFP.Run.ViewData &&
      QFP.Run.ViewData.License &&
      QFP.Run.ViewData.License.type == 'LICENSE_PREMIUM'
    ) {
      getPremiumSupport();
    } else {
      getBasicSupport();
    }
    return false;
  }

  function getBasicSupport() {
    // feedback_widget.show();
    window.open(QFP.Run.ViewData.PublicWeb + '/help/');
  }

  function getPremiumSupport(view, context) {
    window.open(QFP.Run.ViewData.PublicWeb + '/help/');

    // var offer_path = '/popup/contact-us';

    // if(view && typeof(view) == 'string') {
    //     var regexp = new RegExp(/[^a-z^A-Z^0-9-]/g);
    //     view = view.replace(regexp, "-");
    //     offer_path = offer_path + '/view/' + view;
    // }

    // if(context && typeof(context) == 'string') {
    //     offer_path = offer_path + '/context/' + context;
    // }

    // if(QFP.Run.ViewData.Locale && typeof(QFP.Run.ViewData.Locale) == 'string') {
    //     offer_path = offer_path + '/locale/' + QFP.Run.ViewData.Locale;
    // }

    // var o = $.extend({}, {
    //     href: offer_path
    // });

    // QFP.Controllers.Layout.Notifications.showPopup(o);
  }

  return {
    init: init,
    initLinks: initLinks,
    show: show,
    getBasicSupport: getBasicSupport,
    getPremiumSupport: getPremiumSupport,
  };
})();
