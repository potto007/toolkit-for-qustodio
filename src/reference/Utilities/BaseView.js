QFP.Utilities.BaseView = function(newProps, options, classProps) {
  var baseProps = {
    template: null,
    target: null,
    $: function(selector) {
      return $(this.target).find(selector);
    },
    viewObj: {
      blue: function() {
        return function(text, render) {
          return render("<span class='blue'>" + text + '</span>');
        };
      },
      b: function() {
        return function(text, render) {
          return render("<span class='regular'>" + text + '</span>');
        };
      },
      translate: function() {
        return function(text, render) {
          return render(QFP.lng(text));
        };
      },
      tenant: QFP.QInit.Tenant,
      short_name: QFP.QInit.Common.ShortName,
      brand_short_name: QFP.QInit.Common.ShortName,
    },
    _getViewObj: function() {
      return {};
    },
    initialize: function() {},
    attachEvents: function() {
      var self = this;
      this.$('[qfp-click]').click(function(e) {
        var qfpClick = $(this).attr('qfp-click');
        var evtName = 'on' + qfpClick.charAt(0).toUpperCase() + qfpClick.slice(1);
        log.debug('qfp-click event trigger' + evtName);
        if (evtName in self) {
          self[evtName](e);
        }
        if (self.trigger) {
          self.trigger(qfpClick);
        }
      });
      this.$('[qfp-mouseup]').mouseup(function(e) {
        var qfpClick = $(this).attr('qfp-mouseup');
        var evtName = 'on' + qfpClick.charAt(0).toUpperCase() + qfpClick.slice(1);
        log.debug('mousedown event trigger' + evtName);
        if (evtName in self) {
          self[evtName](e);
        }
        if (self.trigger) {
          self.trigger(qfpClick);
        }
      });
      this.$('[qfp-mousedown]').mousedown(function(e) {
        var qfpClick = $(this).attr('qfp-mousedown');
        var evtName = 'on' + qfpClick.charAt(0).toUpperCase() + qfpClick.slice(1);
        log.debug('mousedown event trigger' + evtName);
        if (evtName in self) {
          self[evtName](e);
        }
        if (self.trigger) {
          self.trigger(qfpClick);
        }
      });
      this.$('[qfp-change]').change(function(e) {
        var qfpClick = $(this).attr('qfp-change');
        log.debug('View event change', qfpClick, e);
        var evtName = 'on' + qfpClick.charAt(0).toUpperCase() + qfpClick.slice(1);
        if (evtName in self) {
          self[evtName](e);
        }
        self.trigger(qfpClick);
      });
      this.$('[qfp-focusout]').focusout(function(e) {
        var qfpClick = $(this).attr('qfp-focusout');
        log.debug('View event focus out', qfpClick, e);
        var evtName = 'on' + qfpClick.charAt(0).toUpperCase() + qfpClick.slice(1);
        if (evtName in self) {
          self[evtName](e);
        }
        self.trigger(qfpClick);
      });
      this.$('[qfp-focus]').focus(function(e) {
        var qfpClick = $(this).attr('qfp-focus');
        log.debug('View event focus', qfpClick, e);
        var evtName = 'on' + qfpClick.charAt(0).toUpperCase() + qfpClick.slice(1);
        if (evtName in self) {
          self[evtName](e);
        }
        self.trigger(qfpClick);
      });
      this.$('[qfp-keyup]').keyup(function(e) {
        var qfpClick = $(this).attr('qfp-keyup');
        log.debug('View event keyup', qfpClick, e);
        var evtName = 'on' + qfpClick.charAt(0).toUpperCase() + qfpClick.slice(1);
        if (evtName in self) {
          self[evtName](e);
        }
        self.trigger(qfpClick);
      });
      this.$('[qfp-keypress]').keypress(function(e) {
        var qfpClick = $(this).attr('qfp-keypress');
        log.debug('View event keypress', qfpClick, e);
        var evtName = 'on' + qfpClick.charAt(0).toUpperCase() + qfpClick.slice(1);
        if (evtName in self) {
          self[evtName](e);
        }
        self.trigger(qfpClick);
      });
    },
  };

  if (newProps.attachEvents === undefined) newProps.attachEvents = function() {};

  var extended = $.extend(true, {}, QFP.Utilities.Events, baseProps, classProps, newProps);

  (function(classes) {
    props = classes[0];
    for (propName in props) {
      var prop = props[propName];
      if (typeof prop == 'function') {
        var fncs = [];
        for (var j = classes.length - 1; j > 0; j--) {
          parentProps = classes[j];
          if (propName in parentProps && typeof parentProps[propName] == 'function') {
            fncs.push(parentProps[propName]);
          }
        }
        if (fncs.length) {
          fncs.push(extended[propName]);
          extended[propName] = (function(fncs) {
            return function() {
              for (var i = 0; i < fncs.length; i++) {
                fncs[i].call(extended);
              }
            };
          })(fncs);
        }
      }
    }
  })([newProps, classProps, baseProps]);

  for (optName in options) {
    extended[optName] = options[optName];
  }

  if (extended.getViewObj) {
    extended._getViewObj = extended.getViewObj;
  }
  extended.getViewObj = function() {
    var viewObj = extended._getViewObj();
    var headerObj = {};
    if (this.getHeaderObj) {
      headerObj = this.getHeaderObj();
      for (i in headerObj) {
        if (typeof headerObj[i] == 'function') {
          headerObj[i] = headerObj[i].call(this);
        }
      }
    }
    return $.extend(true, viewObj, extended.viewObj, headerObj);
  };

  extended._render = extended.render;
  extended.render = function() {
    extended._render();
    extended.attachEvents();
  };
  extended.initialize();
  extended.render();
  return extended;
};
