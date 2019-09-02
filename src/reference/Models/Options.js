QFP.Models.Options = QFP.Models.Extend({
  fetch: function() {
    var self = this;
    return $.ajax({
      url: '/v1/accounts/me/options',
      type: 'GET',
      async: true,
    }).done(function(options) {
      self.accountOptions = {};
      options.forEach(option => {
        self.accountOptions[option.key] = option.value;
      });
    });
  },
  post: function(body) {
    var self = this;
    return $.ajax({
      url: '/v1/accounts/me/options',
      type: 'POST',
      data: JSON.stringify(body),
    }).done(function() {
      self.trigger('saved');
    });
  },
  getAll: function() {
    return this.accountOptions;
  },
  get: function(optionKey) {
    return this.accountOptions[optionKey];
  },
  set: function(optionKey, optionValue) {
    this.accountOptions[optionKey] = optionValue;
    const body = {};
    body[optionKey] = optionValue;
    return this.post(body);
  },
});
