///////////////////////////////////////////////////////////////////////////////
//  File:   Web.js
//  Project:    Qustodio Family Portal
//  Company:    Evolium
//  Author:     Francesco Carrella (francesco.carrella@evolium.com)
//  Created:    2011-03-14
///////////////////////////////////////////////////////////////////////////////
QFP.Controllers.UserRules.Apps = (function() {
  var $document,
    $buy_button,
    $content,
    $apps_block_enabled_checkbox,
    $apps_block_list,
    $apps_block_list_items;

  /**
   * Initialize  components
   */

  function init() {
    $content = $('#content');

    // if the page shown a premium offer intead of rules settings, call the method to init premium offer
    if ($content.length && $content.hasClass('premium-offer')) {
      initPremiumOffer();
      return;
    }

    $apps_block_enabled_checkbox = $('input[name=apps_blocking_global]');
    $apps_block_list = $('#apps_block_list');
    $apps_block_list_items = $apps_block_list.children();

    $apps_block_enabled_checkbox.bind({
      change: function() {
        var enabled = $apps_block_enabled_checkbox.is(':checked');
        enableAppsBlocking(enabled);
      },
    });

    $.each($apps_block_list_items, function(i, el) {
      var $list_item = $(el),
        $checkbox = $('input[type="checkbox"]', $list_item),
        $timequota_input = $('.app_time_quota', $list_item),
        app_id = $list_item.data('app-id'),
        app_name = $list_item.data('name'),
        isBlockable = $list_item.data('blockable') == 'blockable';

      if (!isBlockable) {
        // Disable non blockable apps checkboxes
        $checkbox.prop('disabled', true);
        $timequota_input.prop('disabled', true);
        // Bind open modal
        $checkbox.parent().on({
          click: () => openNonBlockableModal(app_name, true),
        });
        $('.lock_icon', $list_item).on({
          click: () => openNonBlockableModal(app_name, false),
        });
      }

      $checkbox.on({
        change: function(e) {
          if (isBlockable) {
            var app_enabled = $checkbox.is(':checked');
            blockApp(app_id, !app_enabled);
            // Tracking event
            var action = app_enabled ? 'on' : 'off';
            _gaq.push(['_trackEvent', 'apps-on-off-fp', action, app_name]);
            trackAppSegment(app_id, app_name, app_enabled);
          }
        },
      });

      $timequota_input
        .timeQuotas({
          unactiveText: QFP.lng('_strAppTimeQuotaUnactive'),
        })
        .on({
          change: function() {
            if (isBlockable) {
              var timequota = $timequota_input.val();
              setAppTimeLimits(app_id, timequota);
            }
          },
        });
    });

    if ($apps_block_list.is('.disabled')) {
      $apps_block_list.block({
        overlayCSS: {
          backgroundColor: '#FFF',
          cursor: 'default',
          opacity: 0.75,
        },
        message: false,
      });
    }
    // loaded by filter
    if (!window.appRulesFilterWidget) {
      window.appRulesFilterWidget = {
        trigger: function() {},
      };
    }
  }

  function initPremiumOffer() {
    ($document = $(document)), ($buy_button = $('a.button_buy'));

    $buy_button.on({
      mousedown: function() {
        $buy_button.addClass('pushed');
      },
      mouseup: function() {
        $buy_button.removeClass('pushed');
      },
      drag: function() {
        $buy_button.removeClass('pushed');
      },
      click: function(event) {
        QFP.Controllers.Layout.Premium.showOffer(QFP.Run.ViewName, 'apps-blocking-offer');
        return false;
      },
    });

    $document.on({
      mouseup: function() {
        $buy_button.removeClass('pushed');
      },
    });
  }

  /**
   * segment tracking for apps
   * @param {string} appId
   * @param {string} appName
   * @param {boolean} appEnabled
   */
  function trackAppSegment(appId, appName, appEnabled) {
    if (appName && appName.toLowerCase() === 'youtube') {
      if (appId && appId.indexOf('android') !== -1) {
        segmentTrackVideoSetupRules(
          appEnabled
            ? EVENT_VIDEO_SETUP_RULES_NAMES.androidEnabled
            : EVENT_VIDEO_SETUP_RULES_NAMES.androidDisabled,
          EVENT_VIDEO_SETUP_SOURCES.youtube
        );
      }
      // add more rule names here.
    }
    // add more apps here.
  }

  /**
   * Enable/Disable categories list
   * @param {Boolean} enable Boolean, if true enable list, if false disable list
   */

  function enableAppsBlocking(enable, save) {
    QFP.Controllers.UserRules.saveSetting('enable_apps_blocking', enable);

    if (enable) {
      $apps_block_list.slideDown('fast', function() {
        $apps_block_list.unblock();
      });
    } else {
      $apps_block_list.block({
        overlayCSS: {
          backgroundColor: '#FFF',
          cursor: 'default',
          opacity: 0.75,
        },
        message: false,
        onBlock: function() {
          $apps_block_list.slideUp();
        },
      });
    }
    window.appRulesFilterWidget.trigger('reloadAppRulesFilter');
  }

  /**
   * Upgrade passed category to new state
   * @param {Boolean} id Category id
   * @param {Boolean} status New status (cab be 'allow', 'alert', 'block')
   * @param {Boolean} save if true ajax save setting call are performed
   */

  function blockApp(app_id, block, save) {
    var $list_item = $('li[data-app-id="' + app_id + '"]'),
      $label = $('label.app_name', $list_item),
      $time_quota = $('.time-quotas', $list_item);

    $label.animate(
      {
        opacity: block ? 0.4 : 1,
      },
      function() {
        $label.toggleClass('disabled', block);
      }
    );

    if (block) {
      $time_quota.fadeOut();
    } else {
      $time_quota.fadeIn().css('display', 'inline-block');
    }

    if (save !== false) {
      QFP.Controllers.UserRules.saveSetting('app_block::' + app_id, block);
    }
    window.appRulesFilterWidget.trigger('reloadAppRulesFilter');
  }

  function setAppTimeLimits(app_id, limits) {
    QFP.Controllers.UserRules.delayedSaveSetting('app_timequota::' + app_id, limits);
    window.appRulesFilterWidget.trigger('reloadAppRulesFilter');
  }

  function showApplicationsRulesScreen() {
    QFP.Utilities.Routing.set({
      controller: 'user-rules',
      view: 'apps',
      days: null,
      day: null,
      filters: null,
    });
  }
  function openNonBlockableModal(appName, fromSwitch) {
    QFP.Modals.AppNonBlockable({ appName: appName });
    if (fromSwitch) {
      //Tracking
      _gaq.push(['_trackEvent', 'apps-on-off-fp', 'blocked', appName]);
    }
  }

  return {
    init: init,
    enableAppsBlocking: enableAppsBlocking,
    blockApp: blockApp,
    showApplicationsRulesScreen: showApplicationsRulesScreen,
  };
})();
