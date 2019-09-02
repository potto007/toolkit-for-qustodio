QFP.Models.AppRules = QFP.Models.Extend({
  getAppByOS: function(platform) {
    var app_rules = [];
    if (this.app_rules.length && this.app_rules[0].platform == undefined) {
      log.error('Missing key app_rules->platform');
      return app_rules;
    }
    $.each(this.app_rules, function() {
      var app_rule = this;
      if (app_rule.platform == platform) app_rules.push(app_rule);
    });
    return app_rules;
  },
  getAppByGroup: function(group) {
    var app_rules = [];
    if (this.app_rules.length && this.app_rules[0].group == undefined) {
      log.error('Missing key app_rules->group');
      return app_rules;
    }
    $.each(this.app_rules, function() {
      var app_rule = this;
      if (app_rule.group == group) app_rules.push('group' + app_rule);
    });
    return app_rules;
  },
  getAppRules: function(rule) {
    var app_rules = [];
    $.each(this.app_rules, function() {
      var app_rule = this;
      if (app_rule[rule]) app_rules.push(app_rule);
    });

    return app_rules;
  },
});

QFP.Models.AppRules.construct = function(app_rules) {
  return this({ app_rules: app_rules });
};
