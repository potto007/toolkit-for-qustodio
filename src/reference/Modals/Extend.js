QFP.Modals.Extend = function(newProps) {
  return function(options) {
    return QFP.Utilities.BaseView(newProps, options, {
      target: null,
      isCloseable: true,
      isClosedByUser: true,

      close: function() {
        if (!this.disabled) {
          this.isClosedByUser = false;
          $(this.target)
            .dialog('close')
            .dialog('destroy')
            .remove();
        }
      },
      overlay: '.ui-widget-overlay',
      attachEvents: function() {
        log.debug('Modal extend attach events');
        var self = this;
        if (this.isCloseable) {
          this.$('[qfp-close-click]').click(function(e) {
            if (!self.disabled) {
              self.close();
              var qfpClick = $(this).attr('qfp-close-click');
              if (qfpClick) {
                var evtName = 'on' + qfpClick.charAt(0).toUpperCase() + qfpClick.slice(1);
                if (evtName in self) {
                  self[evtName](e);
                }
                self.trigger(qfpClick);
              }
            }
          });
        }
        this.$('[qfp-enter]').keypress(function(e) {
          if (e.keyCode == 13) {
            var qfpClick = $(this).attr('qfp-enter');
            if (qfpClick) {
              var evtName = 'on' + qfpClick.charAt(0).toUpperCase() + qfpClick.slice(1);
              if (evtName in self) {
                self[evtName](e);
              }
              self.trigger(qfpClick);
            }
            return false;
          }
        });
      },

      getHeader: function() {
        if (this.header && this.header.id) {
          var template = QFP.Utilities.Templates.getTemplate(this.header.id);
          if (!template) {
            template = $(this.header.id).html();
          }
          return template;
        }
        return '';
      },
      getHeaderObj: function() {
        if (this.header && this.header.vars) {
          return this.header.vars;
        }
        return {};
      },
      disabled: false,
      disable: function() {
        log.debug('Disable modal');
        this.$('input').prop('disabled', true);
        this.$('button').prop('disabled', true);
        this.$('select').prop('disabled', true);
        this.$('.close').prop('disabled', true);
        this.$('a').prop('disabled', true);
        $(this.overlay).prop('disabled', true);
        $(this.target).fadeTo(0.5, 0.8);
        this.disabled = true;
      },
      enable: function() {
        log.debug('Enable modal');
        this.$('input').prop('disabled', false);
        this.$('button').prop('disabled', false);
        this.$('select').prop('disabled', false);
        this.$('.close').prop('disabled', false);
        this.$('a').prop('disabled', false);
        $(this.overlay).prop('disabled', false);
        $(this.target).fadeTo(0.5, 1);
        this.disabled = false;
      },
      render: function() {
        var templateHtml;
        var templateClass = '';
        var templateEle = $(this.template);

        if (templateEle.length) {
          templateHtml = $(this.template).html();
          templateClass = templateEle.attr('class');
        } else {
          templateHtml = QFP.Utilities.Templates.getTemplate(this.template);
        }

        var rendered = Mustache.render(templateHtml, this.getViewObj(), {
          header: this.getHeader(),
        });

        this.target = $('<div>')
          .addClass('modal')
          .html(rendered);

        //close button
        if (this.isCloseable) {
          $('<div>')
            .html('X')
            .addClass('close')
            .attr('qfp-close-click', 'cancel')
            .appendTo(this.target);
        }

        var self = this;
        $(this.target)
          .dialog({
            resizable: false,
            width: this.width || 620,
            closeOnEscape: this.isCloseable,
            dialogClass: 'hideModalDefaults ' + templateClass,
            modal: true,
            zIndex: 20001,
          })
          .on('dialogclose', function(evt) {
            if (self.isClosedByUser) {
              self.trigger('cancel');
            }
          });

        if (this.isCloseable) {
          $(this.overlay).click(function() {
            self.close();
            self.trigger('cancel');
          });
        }
      },
    });
  };
};
