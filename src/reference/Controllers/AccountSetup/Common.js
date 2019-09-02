///////////////////////////////////////////////////////////////////////////////
//  File:   Common.js
//  Company:    Evolium
//  Project:    Qustodio Family Portal
//  Author:     Francesco Carrella (francesco.carrella@evolium.com)
//  Created:    2011-03-30
///////////////////////////////////////////////////////////////////////////////

QFP.Controllers.AccountSetup = (function() {
  var save_settings_url = '/account-setup/save-settings';

  function releaseGenericSaveError() {
    var $notification = QFP.Controllers.Layout.Notifications.showError(
      QFP.lng('_strErrorSavingRule')
    );
    QFP.Controllers.Layout.ContactUs.initLinks($notification);
  }

  function saveSetting(settings_name, setting_value, onSuccess, onError) {
    $.ajax({
      url: save_settings_url,
      type: 'POST',
      data: {
        user: QFP.Run.ViewData.UserId,
        option: settings_name,
        value: setting_value,
      },
      error: function() {
        releaseGenericSaveError();
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

  function validateDirectPurchaseSignUpForm(form) {
    form.validate({
      rules: {
        firstname: {
          required: true,
          maxlength: 40,
        },
        email: {
          required: true,
          email: true,
          maxlength: 60,
        },
        verifyemail: {
          email: true,
          equalTo: "[name='email']",
        },
        password: {
          required: true,
          minlength: 6,
        },
        verifypassword: {
          equalTo: "[name='password']",
        },
      },
      messages: {
        firstname: {
          required: QFP.lng('_strErrorFieldRequired'),
          maxlength: QFP.lng('_strErrorFieldTooLongX'),
        },
        email: {
          required: QFP.lng('_strErrorFieldRequired'),
          maxlength: QFP.lng('_strErrorFieldTooLongX'),
          email: QFP.lng('_strErrorEmail'),
        },
        verifyemail: {
          email: QFP.lng('_strErrorEmail'),
          equalTo: QFP.lng('_strErrorVerifyEmailAddress'),
        },
        password: {
          required: QFP.lng('_strErrorPassword'),
          minlength: QFP.lng('_strErrorPasswordMinLength'),
        },
        verifypassword: {
          required: QFP.lng('_strErrorPassword'),
          minlength: QFP.lng('_strErrorPasswordMinLength'),
          equalTo: QFP.lng('_strErrorVerifyPassword'),
        },
      },
    });

    userAgentParser = new UAParser();

    var sourcePlatform = $("[name='sourcePlatform']");
    sourcePlatform.val('Web');

    var sourceDetails = $("[name='sourceDetails']");
    sourceDetails.val(userAgentParser.getOS().name);

    var sourceOsVersion = $("[name='sourceOsVersion']");
    sourceOsVersion.val(
      userAgentParser.getBrowser().name + '-' + userAgentParser.getBrowser().version
    );

    var deviceTimezone = $("[name='deviceTimezone']");
    deviceTimezone.val(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }

  return {
    saveSetting: saveSetting,
    releaseGenericSaveError: releaseGenericSaveError,
    validateDirectPurchaseSignUpForm: validateDirectPurchaseSignUpForm,
  };
})();
