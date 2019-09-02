///////////////////////////////////////////////////////////////////////////////
//  File:       Requests.js
//  Project:	Qustodio Family Portal
//  Company:    Evolium
//  Author:     Francesco Carrella (francesco.carrella@evolium.com)
//  Created:    2011-03-10
///////////////////////////////////////////////////////////////////////////////

QFP.Utilities.Requests = (function() {
  var requests = [];

  /**
   * ???
   *
   *
   */
  function init(html_element, requests_data) {
    html_element.click(function() {
      openRequest();
    });
    requests = requests_data;
  }

  /**
   * ???
   *
   *
   */
  function openRequest() {
    QFP.Utilities.Dialogs.openConfirmation('Titleeee', 'textttt', [
      {
        text: QFP.lng('_strBttnCancel'),
        autoClose: true,
        className: 'lightGray',
      },
      {
        text: QFP.lng('_strButtYesIAmSure'),
        autoClose: true,
        handler: function() {},
      },
    ]);
  }

  return {
    init: init,
    openRequest: openRequest,
  };
})();
