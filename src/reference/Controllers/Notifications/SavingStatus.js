QFP.Controllers.Layout.Notifications.Controllers.SavingStatus = (function() {
  var SAVED_MESSAGE_DURATION = 2000; // milliseconds
  var DEFAULT_MESSAGES = Array(
    QFP.lng('_strSettingSuccefullySaved'),
    QFP.lng('_strSavingChangesBlockPage')
  );

  var numAJAXSend = 0;

  function durringSaving(messages_arary) {
    if (messages_arary == undefined) {
      messages_arary = DEFAULT_MESSAGES;
    }
    if (numAJAXSend == 0) {
      // Block leave the page event
      window.onbeforeunload = function(e) {
        return messages_arary[1];
      };
    }
    numAJAXSend++;
  }

  function finishSaving(result, message) {
    if (result == undefined) result = 'success';
    if (message == undefined) message = DEFAULT_MESSAGES[0];

    numAJAXSend--;
    if (numAJAXSend == 0) {
      if (result == 'success') showSavedMessage(message);

      // Unblock leave the page event
      window.onbeforeunload = function() {};
    }
  }

  function showSavedMessage(message) {
    var div = document.createElement('div');
    div.setAttribute('id', 'statusMessage');
    div.setAttribute(
      'style',
      "position: fixed;bottom: 20px; right: 20px; font-family: 'Courier New', Courier, monospace; font-size: 10px; color:#999;"
    );
    div.textContent = message;
    $('body').append(div);
    var statusMessage = $('#statusMessage');
    statusMessage.hide();
    statusMessage
      .fadeIn()
      .delay(SAVED_MESSAGE_DURATION)
      .fadeOut('fast', function() {
        statusMessage.remove();
      });
  }

  return {
    durringSaving: durringSaving,
    finishSaving: finishSaving,
  };
})();
