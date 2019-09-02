///////////////////////////////////////////////////////////////////////////////
//  File:       Modals.js
//  Project:    Qustodio Family Portal
//  Company:    Evolium
//  Author:     Francesco Carrella (francesco.carrella@evolium.com)
//  Created:    2013-01-04
///////////////////////////////////////////////////////////////////////////////
QFP.Controllers.Layout.Modal = (function() {
  var $window, window_scroll, $body, $colorbox, $colorboxLoadedContent;

  function init() {
    $window = $(window);
    $body = $('body');
    $colorbox = $('#colorbox');
    $colorboxLoadedContent = $('#cboxLoadedContent');
  }

  function openFullScreen(ajax_options, on_success, on_close) {
    var ajax_defaults = {
        type: 'POST',
        data: {
          raw: true,
        },
        success: function(data) {
          $colorboxLoadedContent = $('#cboxLoadedContent');
          $colorboxLoadedContent.html(data);
          if (on_success && typeof on_success == 'function') {
            on_success($colorboxLoadedContent, data);
          }
        },
      },
      ajax_settings = $.extend(true, {}, ajax_defaults, ajax_options);

    $.colorbox({
      html: '<div id="cboxLoadingGraphic"></div>',
      width: 990,
      height: '100%',
      initialWidth: 990,
      initialHeight: '100%',
      transition: 'none',
      onOpen: function() {
        $colorbox.addClass('full-screen-modal').addClass('hblock');
        window_scroll = $window.scrollTop();
        $body.css('overflow', 'hidden');
        $window.bind('resize', resizeFullScreen);
      },
      onCleanup: function() {
        $body.css('overflow', 'auto');
        setTimeout(function() {
          $window.delay(500).scrollTop(window_scroll);
        }, 1);
        if (on_close && typeof on_close == 'function') {
          on_close();
        }
      },
      onComplete: function() {
        // set inner elements to fullcreen
        resizeFullScreen();
      },
    });

    $.ajax(ajax_settings);
  }

  function resizeFullScreen() {
    $.colorbox.resize({
      height: $window.height() + 10,
    });
  }

  return {
    init: init,
    openFullScreen: openFullScreen,
  };
})();
$(QFP.Controllers.Layout.Modal.init);
