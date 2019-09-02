///////////////////////////////////////////////////////////////////////////////
//  File:	Common.js
//  Company:    Evolium
//  Project:	Qustodio Family Portal
//  Author:     Francesco Carrella (francesco.carrella@evolium.com)
//  Created:    2011-03-14
///////////////////////////////////////////////////////////////////////////////

QFP.Controllers.UserRules = (function() {
  var save_settings_url = '/user-rules/save-settings';
  var pending_saves = {};
  function init() {
    QFP.Utilities.UIDecorations.iPhoneStyleCheckboxes();
    QFP.Utilities.UIDecorations.equalColumnsHeight();
  }

  function releaseGenericSaveError() {
    var msg = Mustache.render(QFP.lng('_strErrorSavingSetting'), {
      help_contact_link: QFP.QInit.Marketing.PublicSite.help_contact,
    });
    QFP.Controllers.Layout.Notifications.showError(msg);
  }

  function saveSetting(settings_name, setting_value, onSuccess, onError) {
    $.ajax({
      url: save_settings_url,
      type: 'POST',
      data: {
        user: QFP.Run.ViewData.UserId,
        device: QFP.Run.ViewData.SelectedDevice,
        optionName: settings_name,
        value: setting_value,
      },
      beforeSend: function(jqXHR) {
        QFP.Controllers.Layout.Notifications.Controllers.SavingStatus.durringSaving();
      },
      error: function() {
        QFP.Controllers.Layout.Notifications.Controllers.SavingStatus.finishSaving('error');
        releaseGenericSaveError();
      },
      success: function(data) {
        QFP.Controllers.Layout.Notifications.Controllers.SavingStatus.finishSaving('success');
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

  function delayedSaveSetting(setting_name, setting_value, delay, onSuccess, onError) {
    var default_delay = 1000;
    delay = delay ? delay : default_delay;

    if (pending_saves[setting_name]) {
      clearInterval(pending_saves[setting_name]);
    }
    pending_saves[setting_name] = setTimeout(function() {
      saveSetting(setting_name, setting_value, onSuccess, onError);
    }, delay);
  }

  return {
    init: init,
    saveSetting: saveSetting,
    delayedSaveSetting: delayedSaveSetting,
  };
})();
