QFP.Widgets.AppRulesFilter = QFP.Widgets.Extend({
  required: ['appRulesModel'],
  hide: true,
  template: '#input-filter-tpl',
  target: '#app_rules',
  selected_data: undefined,
  attachEvents: function() {},
  getViewObj: function() {
    var count_windows = this.appRulesModel.getAppByOS(0).length;
    var count_mac = this.appRulesModel.getAppByOS(1).length;
    var count_android = this.appRulesModel.getAppByOS(2).length;
    // var count_linux = this.appRulesModel.getAppByOS(3).length;
    var count_ios = this.appRulesModel.getAppByOS(4).length;

    var count_all = count_android + count_ios + count_mac + count_windows;

    var count_group_1 = this.appRulesModel.getAppByGroup(1).length;
    var count_blocked = this.appRulesModel.getAppRules('blocked').length;
    var count_with_time_limit = this.appRulesModel.getAppRules('timelimit').length;
    return {
      options: [
        {
          text: '_strAllApps',
          count: count_all,
          filter: 'app_rules:-1',
          sep: true,
        },
        {
          text: '_strAndroidApps',
          count: count_android,
          filter: 'app_rules:2',
          sep: count_ios || count_mac || count_windows ? false : true,
        },
        {
          text: '_strIosApps',
          count: count_ios,
          filter: 'app_rules:4',
          sep: count_mac || count_windows ? false : true,
        },
        {
          text: '_strMacApps',
          count: count_mac,
          filter: 'app_rules:1',
          sep: count_windows ? false : true,
        },
        {
          text: '_strWindowsApps',
          count: count_windows,
          filter: 'app_rules:0',
          sep: true,
        },
        {
          text: 'Group 1',
          count: count_group_1,
          filter: 'app_rules:group1',
        },
        {
          text: '_strBlockApps',
          count: count_blocked,
          filter: 'app_rules:blocked',
        },
        {
          text: '_strAppsWithTimeLimits',
          count: count_with_time_limit,
          filter: 'app_rules:timelimit',
        },
      ],
    };
  },
  onFocus: function(e) {
    var $input = $(e.target);

    var isOptionVal = false;

    var self = this;
    this.$('.input-filter-option').each(function() {
      var $count = $(this)
        .closest('.input-filter-option-wrapper')
        .find('.input-count');
      if ($(this).html() + ' ' + $count.html() == $input.val()) {
        isOptionVal = true;
        self.inputVal = $input.val();
      }
    });
    if (isOptionVal) $input.val('');
    this.showDropdown();
  },
  onFocusOut: function(e) {
    var $input = $(e.target);

    if ($input.val() == '') {
      $input.val(this.inputVal);
      var self = this;
      this.$('.input-filter-option').each(function() {
        var $count = $(this)
          .closest('.input-filter-option-wrapper')
          .find('.input-count');
        if ($(this).html() + ' ' + $count.html() == $input.val()) {
          self.trigger('filterByOption', $(this).attr('data-filter'));
        }
      });
    }
    if (this.hide) {
      this.hideDropdown();
    }
  },
  onEnter: function(e) {
    if (e.keyCode == 27) {
      this.$('.input-filter-option-wrapper')
        .eq(0)
        .mousedown()
        .mouseup();
      return;
    }

    if (this.$input.val() == '') {
      this.showDropdown();
    } else {
      this.hideDropdown();
    }
    this.trigger('filterByInput', this.$input.val());
  },
  onHide: function() {
    this.hide = true;
    this.hideDropdown();
  },
  onSelect: function(e) {
    log.debug(e.target);
    this.hide = false;
    var selected = $(e.target)
      .closest('.input-filter-option-wrapper')
      .find('.input-filter-option');

    var count = $(e.target)
      .closest('.input-filter-option-wrapper')
      .find('.input-count');

    this.trigger('filterByOption', selected.attr('data-filter'));
    this.$input.val(selected.html() + ' ' + count.html());
  },
  onFocusText: function(e) {
    this.$('.input-filter-option-wrapper').show();
    this.$input.focus();
    e.stopPropagation();
  },
  render: function() {
    this.$input = this.$('.input-filter-text');
    if (this.selected_data == undefined) {
      if (this.inputVal) {
        this.$input.val(this.inputVal);
      }
    } else {
      switch (this.selected_data.filterBy) {
        case 'Option':
          var value_element = $(
            ".input-filter-option[data-filter='" + this.selected_data.value + "']"
          );
          var filter_text = '';
          if (value_element.length == 0) {
            this.selected_data.value = 'app_rules:-1';
            value_element = $(
              ".input-filter-option[data-filter='" + this.selected_data.value + "']"
            );
          }
          if (value_element.html() != null) {
            filter_text =
              value_element.html() + ' ' + $('.input-count', value_element.parent()).html();
          }
          this.$input.val(filter_text);
          break;

        case 'Input':
          this.$input.val(this.selected_data.value);
          break;
      }
    }
  },
  showDropdown: function() {
    var width = this.$('.input-filter-select-wrapper').width();
    this.$('.input-filter-options-wrapper').width(width);
    this.$input.addClass('dropdown');
    this.$('.input-filter-icon-wrapper').addClass('dropdown');
    this.$('.input-filter-options-wrapper').show();
  },
  hideDropdown: function() {
    this.$input.removeClass('dropdown');
    this.$('.input-filter-icon-wrapper').removeClass('dropdown');
    this.$('.input-filter-options-wrapper').hide();
  },
});
