///////////////////////////////////////////////////////////////////////////////
//  File:	Localization.js
//  Project:	Qustodio Family Portal
//  Company:    Evolium
//  Author:     Francesco Carrella (francesco.carrella@evolium.com)
//  Created:    2011-02-21
///////////////////////////////////////////////////////////////////////////////

QFP.Utilities.Localization = (function() {
  var languageData = {};

  return {
    setLanguageData: function(inLanguageData) {
      languageData = inLanguageData;
    },
    getTranslation: function(identifier, repParams) {
      if (languageData[identifier] !== undefined) {
        var ret = languageData[identifier];
        for (var key in repParams) {
          if (repParams[key]) {
            ret = ret.replace(new RegExp(key, 'g'), repParams[key]);
          }
        }
        return ret;
      } else {
        return identifier;
      }
    },
  };
})();

QFP.lng = QFP.Utilities.Localization.getTranslation;
