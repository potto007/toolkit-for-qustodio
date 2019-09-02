///////////////////////////////////////////////////////////////////////////////
//  File:	Common.js
//  Company:    Evolium
//  Project:	Qustodio Family Portal
//  Author:     Francesco Carrella (francesco.carrella@evolium.com)
//  Created:    2011-03-31
///////////////////////////////////////////////////////////////////////////////

QFP.Controllers.UserSetup = (function() {
  var save_settings_url = '/user-setup/save-settings/',
    total_users;

  function init(in_total_users) {
    total_users = in_total_users;
  }

  function startFamilySetup() {
    QFP.Utilities.Dialogs.openExternal('/user-setup/wizard-number-users/enviroment/qfp/');
  }

  function createUser(redirect) {
    editUser(null, redirect);
  }

  function editUser(user_id, redirect) {
    var dialog_url = '/user-setup/dialog-new-edit-user/' + (user_id ? 'user/' + user_id + '/' : '');
    var dialog = QFP.Utilities.Dialogs.openExternal(dialog_url);

    dialog.load(function() {
      var dialog_content = dialog.contents();
      var dialog_body = $('body', dialog_content);
      var form = $('form', dialog_content);
      var button_close = $('button#setup-button-bar-close', dialog_content);
      var button_save = $('button#setup-button-bar-save', dialog_content);

      $(form)
        .submit(function() {
          return false;
        })
        .validate({
          rules: {
            userName: {
              required: true,
              maxlength: QFP.Definitions.MaxLengthFields.profileName,
            },
            birthYear: {
              required: true,
            },
          },
          messages: {
            userName: {
              required: QFP.lng('_strErrorFieldRequired'),
              maxlength: QFP.lng('_strErrorFieldTooLongX'),
            },
            birthYear: {
              required: QFP.lng('_strErrorFieldRequired'),
            },
          },
        });

      button_close.click(function(e) {
        dialog.dialog('destroy');
      });

      button_save.click(function(e) {
        var is_add = user_id ? false : true;

        if (form.valid()) {
          dialog_body.block({
            overlayCSS: {
              backgroundColor: '#DDE2E7',
              opacity: 0.75,
            },
            message: false,
          });
          QFP.Controllers.Settings.saveSetting(
            save_settings_url,
            form.serialize(),
            function(data) {
              if (is_add) {
                total_users++;
              }
              dialog.dialog('destroy');
              data.userInfo.gender_translated =
                data.userInfo.gender === 'MALE' ? QFP.lng('_strMale') : QFP.lng('_strFemale');
              if (data.userInfo.gender === 'MALE') {
                data.userInfo.gender_male = 1;
              } else {
                data.userInfo.gender_felame = 1;
              }
              updateViews(is_add ? 'add' : 'edit', data.userInfo);

              if (redirect === true)
                window.location.href = '/user-activity/summary/user/' + data.userInfo.id;
            },
            function(data) {
              dialog_body.unblock();
              $.each(data.errors, function(key, error) {
                if (error.substr(0, 4) == '_str') {
                  data.errors[key] = QFP.lng(error);
                }
              });
              dialog[0].contentWindow
                .$(form)
                .validate()
                .showErrors(data.errors);
            }
          );
        }
      });
    });
  }

  function removeProfile(user_id, user_name) {
    QFP.Utilities.Dialogs.openConfirmation(
      QFP.lng('_strDialogRemoveUserTitle', {
        user_name: user_name,
      }),
      QFP.lng('_strDialogRemoveUserDescription'),
      [
        {
          text: QFP.lng('_strBttnCancel'),
          autoClose: true,
          className: 'lightGray',
        },
        {
          text: QFP.lng('_strButtYesIAmSure'),
          autoClose: true,
          handler: function() {
            QFP.Controllers.Settings.saveSetting(save_settings_url, {
              optionName: 'del_user',
              id: user_id,
            });

            total_users--;
            updateViews('remove', user_id);
          },
        },
      ]
    );
  }

  function updateViews(type, config) {
    if (QFP.Run.PagingEnabled) {
      location.reload();
      return false;
    }
    switch (type) {
      case 'add':
        // create new user switcher li
        $('#user_switcher ul li.add-profile').before(
          QFP.Utilities.Templates.render('user_switcher_li', config)
        );

        // if we are in to Settings page, add new "user list" line
        if ($('#settings #users_list').length) {
          var new_li = $(QFP.Utilities.Templates.render('settings_users_li', config))
            .appendTo($('#settings #users_list'))
            .hide()
            .slideDown();
          QFP.Controllers.UserSetup.SettingsIndex.applyButtonsBinding(new_li);
          QFP.Controllers.Layout.UserSwitcher.refreshAddProfileButton();
        }

        break;

      case 'edit':
        // replace the name into user navigation bar
        $('#user_switcher li[user_id="' + config.id + '"] span').html(config.name);

        // if we are in to Settings page, find the user related "users list" line, remove old and put the new one
        if ($('#settings #users_list').length) {
          var old_li = $('#settings #users_list li[item_id="' + config.id + '"]');
          var new_li = $(QFP.Utilities.Templates.render('settings_users_li', config)).insertBefore(
            old_li
          );
          QFP.Controllers.UserSetup.SettingsIndex.applyButtonsBinding(new_li);
          old_li.remove();
        }

        break;

      case 'remove':
        // remove the name into user navigation bar
        $('#user_switcher li[user_id="' + config + '"]').remove();

        // if we are in to Settings page, find the user related "users list" line and remove it
        if ($('#settings #users_list').length) {
          var li = $('#settings #users_list li[item_id="' + config + '"]');
          li.slideUp(200, function() {
            li.remove();
            QFP.Controllers.Layout.UserSwitcher.refreshAddProfileButton();
          });
        }
        break;
    }

    // Check if can remove the over-limit-box
    var num_devices = $('#devices_list li.item').length;
    var limit_reached_box = $('#limit-reached-box');
    if (
      total_users <= QFP.Run.ViewData.License.max_profiles &&
      num_devices <= QFP.Run.ViewData.License.max_devices &&
      limit_reached_box.is(':visible')
    ) {
      limit_reached_box.slideUp('fast');
      _gaq.push([
        '_trackEvent',
        'account-over-limit',
        'delete-profile',
        'locale-' + QFP.Run.ViewData.Locale + '-acl_id-' + QFP.Run.ViewData.License.acl_id,
      ]);
    }

    // Update "add user" buttons visibility:
    var user_switcher_add_button = $('#user_switcher ul li.new-user');
    var settings_users_add_button = $('#settings #add_user_button');
    var user_limit_reached_warning = $('#settings #user_limit_reached_warning');
    var limit_reached_box = $('#limit-reached-box');

    if (total_users < QFP.Run.ViewData.License.max_profiles) {
      user_switcher_add_button.removeClass('hidden');
      settings_users_add_button.removeClass('hidden');
      user_limit_reached_warning.addClass('hidden');
    } else {
      user_switcher_add_button.addClass('hidden');
      settings_users_add_button.addClass('hidden');
      user_limit_reached_warning.removeClass('hidden');
    }
  }

  function openSendDownloadLinkForm(source) {
    var source = source == undefined ? '' : '?source=' + source;
    var options = { href: '/user-setup/send-downloadlink/' + source, width: 600, height: 300 };

    QFP.Controllers.Layout.Notifications.showPopup(options);
  }

  return {
    init: init,
    startFamilySetup: startFamilySetup,
    createUser: createUser,
    editUser: editUser,
    removeProfile: removeProfile,
    openSendDownloadLinkForm: openSendDownloadLinkForm,
  };
})();
