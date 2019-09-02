///////////////////////////////////////////////////////////////////////////////
//  File:	Dialogs.js
//  Project:	Qustodio Family Portal
//  Company:    Evolium
//  Author:     Francesco Carrella (francesco.carrella@evolium.com)
//  Created:    2011-03-10
///////////////////////////////////////////////////////////////////////////////

QFP.Utilities.Dialogs = (function() {
  var defaults = {};

  var dialogs = [];

  /**
   * Close all currently opened dialogs
   */
  function closeAll() {
    $(dialogs).each(function() {
      $(this).remove();
    });
  }

  /**
   * Show a dialog with a iframe showing passed url
   *
   * @param <string> url The url to show
   * @param <object> config jQueryUI.dialog config object
   *
   * @return <object> The created jQuery object (with .dialog() method)
   *
   */
  function openExternal(url, config) {
    var options = $.extend(
      {},
      defaults,
      {
        width: 620,
        height: 450,
        dialogClass: 'full-page',
        modal: true,
        closeOnEscape: false,
        closeOnClickOverlay: false,
        resizable: false,
        autoResize: false,
        close: function(ev, ui) {
          $(this).remove();
        },
      },
      config
    );

    var new_dialog = $('<iframe src="' + url + '" />')
      .dialog(options)
      .width(options.width)
      .height(options.height);

    dialogs.push(new_dialog);

    if (options.closeOnClickOverlay) {
      $('.ui-widget-overlay').bind('click', function() {
        new_dialog.dialog('close');
      });
    }

    return new_dialog;
  }

  /**
   * Show a confirmation dialog with a passed message/description and a serie of buttons
   *
   * @param <string> msg The "title" of window
   * @param <string> description Descriptive text
   * @param <array> buttons Array of object used to create the buttons; each button object config can contain tehse paramenters:
   *      text: The text will be showed into the button
          className: A css class applied to the button
          autoClose: If TRUE the click on the button close the window (before executing the handler function)
          handler: The method to execute on click on the button
   * @param <object> config jQueryUI.dialog config object
   *
   * @return <object> The created jQuery object (with .dialog() method)
   *
   */
  function openConfirmation(msg, description, buttons, config) {
    $.each(buttons, function(name, config) {
      config.click = function() {
        if (config.autoClose !== false) {
          $(this).remove();
        }

        if (config.handler) {
          config.handler();
        }
      };
    });

    var options = $.extend(
      {
        title: msg,
      },
      config,
      {
        width: 360,
        //height : 177,
        dialogClass: 'confirmation',
        modal: true,
        resizable: false,
        buttons: buttons,
      },
      defaults
    );

    var new_dialog = $('<div/>')
      .html(description)
      .dialog(options);

    dialogs.push(new_dialog);

    return new_dialog;
  }

  /**
   * Show a form dialog with a serie of passed form inputs fields & buttons
   *
   * @param <string> msg The "title" of window
   * @param <string> description Descriptive text
   * @param <array> fields Array of object used to create the input fields; each field object config can contain these paramenters:
   *      type: The type of the fied (ej. 'text', 'radio', etc.)
   *      name:The name of field
   *      label: The label will be showed at left of field
   *      defaultText: Default text showed into the field
   * @param <array> buttons Array of object used to create the buttons; each button object config can contain these paramenters:
   *      text: The text will be showed into the button
   *      className: A css class applied to the button
   *      autoClose: If TRUE the click on the button close the window (before executing the handler function)
   *      handler: The method to execute on click on the button
   * @param <object> config jQueryUI.dialog config object
   *
   * @return <object> The created jQuery object (with .dialog() method)
   *
   */
  function openInputsForm(msg, description, fields, buttons, config) {
    var new_dialog;

    $.each(buttons, function(name, config) {
      config.click = function() {
        if (config.autoClose !== false) {
          $(this).remove();
        }

        if (config.handler) {
          config.handler(new_dialog);
        }
      };
    });

    var options = $.extend(
      {
        title: msg,
      },
      config,
      {
        width: 420,
        dialogClass: 'input-form',
        modal: true,
        resizable: false,
        buttons: buttons,
      },
      defaults
    );

    new_dialog = $('<form/>')
      .html(description)
      .dialog(options)
      .submit(function() {
        return false;
      });

    var inputs_container = $('<ul/>').appendTo(new_dialog);

    $.each(fields, function(index, config) {
      var label = $('<label/>')
        //.attr('style', 'width: 120px; float:left;')
        .html(config.label);

      var input = $('<input/>')
        .attr('type', config.type)
        //.attr('style', 'margin: 10px 0 10px 10px; float:left;')
        .attr('name', config.name)
        .attr('value', config.defaultText || '');

      $('<li/>')
        .attr('class', 'clearfix')
        .append(label)
        .append(input)
        .appendTo(inputs_container);
    });

    dialogs.push(new_dialog);

    return new_dialog;
  }

  return {
    openExternal: openExternal,
    openConfirmation: openConfirmation,
    openInputsForm: openInputsForm,
    closeAll: closeAll,
  };
})();
