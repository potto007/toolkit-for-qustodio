///////////////////////////////////////////////////////////////////////////////
//  File:	Common.js
//  Company:    Evolium
//  Project:	Qustodio Family Portal
//  Author:     Francesco Carrella (francesco.carrella@evolium.com)
//  Created:    2011-04-13
///////////////////////////////////////////////////////////////////////////////

QFP.Controllers.Settings = (function() {
  var settings_li;

  function init() {
    settings_li = $('#settings li.setting');

    settings_li.each(function() {
      var li = $(this);

      li.click(function(e) {
        $(e.target)
          .parents()
          .is('.setting-content');
        if (
          !$(e.target).is('.setting-content') &&
          !$(e.target)
            .parents()
            .is('.setting-content') &&
          !$(e.target).is('.setting-buttonbar') &&
          !$(e.target)
            .parents()
            .is('.setting-buttonbar')
        ) {
          if (!li.hasClass('selected')) {
            closeAllSettings();
            openSetting(li);
          } else {
            closeSetting(li);
          }
        }
      });
    });
  }

  function saveSetting(url, data, onSuccess, onError) {
    $.ajax({
      url: url,
      type: 'POST',
      data: data,
      error: function(jqXHR, textStatus, errorThrown) {
        if (errorThrown) releaseGenericSaveError();
      },
      success: function(data) {
        if (data && data.success) {
          if (onSuccess) {
            onSuccess(data);
          }
        } else {
          if (onError) {
            onError(data);
          } else {
            releaseGenericSaveError();
          }
        }
      },
    });
  }

  function releaseGenericSaveError() {
    var msg = Mustache.render(QFP.lng('_strErrorSavingSetting'), {
      help_contact_link: QFP.QInit.Marketing.PublicSite.help_contact,
    });
    QFP.Controllers.Layout.Notifications.showError(msg);
  }

  function closeSetting(li) {
    var description = $('.setting-description', li);
    var content = $('.setting-content', li);
    var buttonbar = $('.setting-buttonbar', li);
    content.slideUp(200);
    content.block({
      overlayCSS: {
        backgroundColor: '#DDE2E7',
        opacity: 0.75,
      },
      message: false,
    });
    buttonbar.slideUp(200);
    description.slideDown(200);
    li.removeClass('selected');
  }

  function openSetting(li) {
    var description = $('.setting-description', li);
    var content = $('.setting-content', li);
    var buttonbar = $('.setting-buttonbar', li);
    content.slideDown(200);
    content.unblock();
    buttonbar.slideDown(200);
    description.slideUp(200);
    li.addClass('selected');
  }

  function closeAllSettings() {
    settings_li.each(function() {
      var current = $(this);
      closeSetting(current);
    });
  }

  return {
    init: init,
    closeSetting: closeSetting,
    saveSetting: saveSetting,
  };
})();
