///////////////////////////////////////////////////////////////////////////////
//  File:       UserSwitcher.js
//  Project:    Qustodio Family Portal
//  Company:    Qustodio
//  Created:    2013-07-05
///////////////////////////////////////////////////////////////////////////////

QFP.Controllers.Layout.UserSwitcher = (function() {
  var $user_switcher_wrapper,
    $tabs_bar,
    $profiles_items,
    $add_profile_tab,
    $dropdown,
    $dropdown_text,
    $dropdown_menu,
    $dropdown_sort_options,
    $dropdown_profiles_list,
    profiles_config,
    $e_label;

  function init() {
    ($user_switcher_wrapper = $('#user_switcher .wrapper')),
      ($tabs_bar = $('ul.tabbar', $user_switcher_wrapper)),
      ($profiles_items = $('li.profile', $tabs_bar));
    $add_profile_tab = $('li.add-profile', $tabs_bar);
    $add_device_tab = $('li.add-device', $tabs_bar);
    $e_label = $('body').attr('e_label');

    // if (false) {
    if (sumItemsWidths() > $tabs_bar.width()) {
      profiles_config = getUserDataFromTabs($profiles_items);
      profiles_config = sortProfiles(profiles_config, $.cookie('q-user-switcher-sort'));
      if (!QFP.Run.PagingEnabled) createDropDown(profiles_config).prependTo($user_switcher_wrapper);

      $tabs_bar.css('display', 'inline-block');
      $profiles_items.remove();
      $add_profile_tab.fadeIn();
    } else {
      $profiles_items.fadeIn();
      $add_profile_tab.fadeIn();
    }

    this.addProfileBind();
    this.addDeviceBind();
  }

  function refreshAddProfileButton() {
    var profile_counter = $('.item.user').length;
    $('.add-profile').remove();

    if (
      !(
        !QFP.QInit.Dashboard.LicenseLimitReached.EnableAddProfileTab &&
        profile_counter >= QFP.Run.ViewData.License.max_profiles
      )
    ) {
      // Show add profile button
      $('#user_switcher ul li.profile:last').after(
        QFP.Utilities.Templates.render('add_user_switcher_li')
      );
      this.addProfileBind();
    } else {
      // Hide add profile button
      $('.add-profile').remove();
    }
  }

  function addProfileBind(init_vars) {
    ($user_switcher_wrapper = $('#user_switcher .wrapper')),
      ($tabs_bar = $('ul.tabbar', $user_switcher_wrapper)),
      ($profiles_items = $('li.profile', $tabs_bar));
    $add_profile_tab = $('li.add-profile', $tabs_bar);
    $e_label = $('body').attr('e_label');

    $add_profile_tab.on('click', function() {
      var category = 'add-profile-tab-button';
      var context = 'add_profile';
      if (QFP.Run.ViewData.NumProfiles >= QFP.Run.ViewData.License.max_profiles) {
        var action = 'flyover-account-overlimit';
        QFP.Controllers.Layout.Notifications.showPopup(
          $.extend(
            { href: '/popup/account-overlimit/?context=' + context },
            { width: 760, height: 460 }
          )
        );
        _gaq.push(['_trackEvent', category, action, $e_label + '-context-' + context]);
      } else {
        var action = 'add_profile';
        QFP.Controllers.UserSetup.createUser(true);
        _gaq.push(['_trackEvent', category, action, $e_label + '-context-' + context]);
      }
    });
  }

  function addDeviceBind(init_vars) {
    ($user_switcher_wrapper = $('#user_switcher .wrapper')),
      ($tabs_bar = $('ul.tabbar', $user_switcher_wrapper)),
      ($add_device_tab = $('li.add-device', $tabs_bar));
    $e_label = $('body').attr('e_label');
    $add_device_tab.on('click', function() {
      var category = 'add-device-tab-button';
      var context = 'add_device';
      if (QFP.Run.ViewData.NumDevices >= QFP.Run.ViewData.License.max_devices) {
        var action = 'flyover-account-overlimit';
        QFP.Controllers.Layout.Notifications.showPopup(
          $.extend(
            { href: '/popup/account-overlimit/?context=' + context },
            { width: 760, height: 460 }
          )
        );
        _gaq.push(['_trackEvent', category, action, $e_label + '-context-' + context]);
      } else {
        var action = 'add-device';
        _gaq.push(['_trackEvent', category, action, $e_label + '-context-' + context]);
        window.location.href = '/account-setup/add-device/';
      }
    });
  }

  function sumItemsWidths($items) {
    var full_width = 0;
    $profiles_items.each(function() {
      full_width += $(this).outerWidth(true);
    });
    full_width += $add_profile_tab.outerWidth(true);
    full_width += $add_device_tab.outerWidth(true);
    return full_width;
  }

  function getUserDataFromTabs($tabs) {
    return $.map($tabs, function(tab) {
      var $tab = $(tab),
        $tab_link = $('a', $tab);
      return {
        name: $.trim($tab.text()),
        lastseen: $tab.data('lastseen'),
        lastseentext: $tab.data('lastseen-text'),
        href: $tab_link.attr('href'),
        selected: $tab.hasClass('selected'),
      };
    });
  }

  function sortProfiles(profiles, field) {
    direction = 1;

    if (!field) {
      field = 'name';
    } else if (field == 'lastseen') {
      direction = -1;
    }

    return profiles.sort(function(a, b) {
      var a_value = a[field].toLowerCase(),
        b_value = b[field].toLowerCase();

      if (a_value == b_value) {
        return 0;
      } else if (a_value > b_value) {
        return 1 * direction;
      } else {
        return -1 * direction;
      }
    });
  }

  function createDropDown(profiles) {
    // general dropdown container
    $dropdown = $('<div>', {
      class: 'dropdown',
    }).hoverIntent({
      over: $.noop,
      out: function() {
        toggleMenu(false);
      },
      timeout: 500,
    });

    // always visible text element
    $dropdown_text = $('<div>', {
      html: profiles.length + ' ' + QFP.lng('_strProfiles'),
      class: 'dropdown-text',
    })
      .on('click', function(e) {
        toggleMenu();
      })
      .appendTo($dropdown);

    // dropdown menu container
    $dropdown_menu = $('<div>', {
      class: 'menu hblock clearfix',
    }).appendTo($dropdown);

    // sort options menu
    $dropdown_sort_options = createDropDownSortOptions().appendTo($dropdown_menu);

    // dropdown menu profiles list
    $dropdown_profiles_list = createDropDownProfilesList(profiles).appendTo($dropdown_menu);

    return $dropdown;
  }

  function createDropDownSortOptions() {
    var $options_menu = $('<div>', {
        html: QFP.lng('_strOrderBy') + ': ',
        class: 'sort-options',
      }),
      $options = $([
        {
          html: QFP.lng('_strAZ'),
          'data-sort': 'name',
        },
        {
          html: QFP.lng('_strLastSeen'),
          'data-sort': 'lastseen',
        },
      ])
        .map(function(i, config) {
          return $('<span/>', config).get(0);
        })
        .appendTo($options_menu),
      current_sorting = $.cookie('q-user-switcher-sort') || 'name';

    $options.filter('[data-sort="' + current_sorting + '"]').addClass('selected');

    $options.on({
      click: function() {
        $this = $(this);
        if (!$this.hasClass('selected')) {
          $options.removeClass('selected');
          $this.addClass('selected');
          changeSorting($this.data('sort'));
        }
      },
    });

    return $options_menu;
  }

  function createDropDownProfilesList(profiles) {
    var $profiles = $('<ul>', {
      class: 'profiles',
    });
    $.each(profiles, function(i, profile) {
      var $profiles_item = $('<li>', {
        class: profile.selected ? 'selected' : '',
      }).appendTo($profiles);
      $('<h2>')
        .appendTo($profiles_item)
        .html(profile.name);
      $('<p>')
        .appendTo($profiles_item)
        .html(
          profile.lastseen
            ? QFP.lng('_strLastConnectionX', { '{{date}}': profile.lastseentext })
            : QFP.lng('_strStatsNoLastConn')
        );
      $profiles_item.on('click', function() {
        window.location.href = profile.href;
      });
    });
    return $profiles;
  }

  function toggleMenu(show) {
    if (show === undefined) {
      show = !$dropdown_menu.is(':visible');
    }

    if (show) {
      $dropdown_menu.slideDown(300);
      $dropdown.addClass('show-menu');
    } else {
      $dropdown_menu.slideUp(300, function() {
        $dropdown.removeClass('show-menu');
      });
    }
  }

  function changeSorting(field) {
    $.cookie('q-user-switcher-sort', field, { path: '/' });
    profiles_config = sortProfiles(profiles_config, field);
    $dropdown_profiles_list.fadeOut(function() {
      $dropdown_profiles_list.remove();
      $dropdown_profiles_list = createDropDownProfilesList(profiles_config)
        .appendTo($dropdown_menu)
        .hide()
        .fadeIn();
    });
  }

  function addProfileByUrl() {
    if (window.location.hash == '#add-profile') {
      if (QFP.Run.ViewData.NumProfiles >= QFP.Run.ViewData.License.max_profiles) {
        QFP.Controllers.Layout.Notifications.showPopup(
          $.extend(
            { href: '/popup/account-overlimit/?context=' + context },
            { width: 760, height: 460 }
          )
        );
      } else {
        QFP.Controllers.UserSetup.createUser(true);
      }
    }
  }

  return {
    init: init,
    toggleMenu: toggleMenu,
    changeSorting: changeSorting,
    refreshAddProfileButton: refreshAddProfileButton,
    addProfileBind: addProfileBind,
    addDeviceBind: addDeviceBind,
    addProfileByUrl: addProfileByUrl,
  };
})();
