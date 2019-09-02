QFP.Models.Extend = function(newProps) {
  return function(options) {
    var viewProps = {
      _save: newProps.save,
    };

    var extended = $.extend(true, viewProps, QFP.Utilities.Events, newProps);
    for (propName in options) {
      extended[propName] = options[propName];
    }
    extended.save = function() {
      this.trigger('save');
      return this._save();
    };

    if (extended.initialize) extended.initialize();
    return extended;
  };
};

QFP.Models.POST = function(url, data, Model, args) {
  var dfd = $.Deferred();
  $.ajax({
    url: url,
    type: 'POST',
    dataType: 'json',
    data: JSON.stringify(data),
  })
    .done(function(responseData) {
      var model = Model.construct.apply(Model, [responseData].concat(args));
      dfd.resolveWith(model, [model]);
    })
    .fail(function(xhr) {
      dfd.reject(xhr);
    });
  return dfd;
};

QFP.Models.GET = function(url, Model, args) {
  var dfd = $.Deferred();

  //convert arguments object to array
  args = args ? Array.prototype.slice.call(args) : [];

  //log.debug("GET", url, Model, args);
  var modelInstance;
  if (Model.getCached) modelInstance = Model.getCached.apply(Model, args);

  if (modelInstance) {
    dfd.resolveWith(modelInstance, [modelInstance]);
  } else {
    $.ajax({
      url: url,
      type: 'GET',
    })
      .done(function(responseData) {
        log.debug('args ', args);
        log.debug('responseData ', responseData);

        modelInstance = Model.construct.apply(Model, [responseData].concat(args));
        dfd.resolveWith(modelInstance, [modelInstance]);
      })
      .fail(function(xhr) {
        dfd.reject(xhr);
      });
  }
  return dfd;
};

QFP.Models.DELETE = function(url, Model, args) {
  var dfd = $.Deferred();
  $.ajax({
    url: url,
    type: 'DELETE',
  })
    .done(function(device) {
      if (Model.removeCached) Model.removeCached.apply(Model, args);
      dfd.resolve();
    })
    .fail(function(xhr) {
      dfd.reject(xhr);
    });
  return dfd;
};
