///////////////////////////////////////////////////////////////////////////////
//  File:	Templates.js
//  Project:	Qustodio Family Portal
//  Company:    Evolium
//  Author:     Francesco Carrella (francesco.carrella@evolium.com)
//  Created:    2011-03-10
///////////////////////////////////////////////////////////////////////////////

QFP.Utilities.Templates = (function() {
  var templates = {};
  return {
    setTemplateData: function(inTemplatesData) {
      templates = inTemplatesData;
    },
    getTemplate: function(inTemplateId) {
      return templates[inTemplateId];
    },
    render: function(inTemplateId, inTemplatesData) {
      return Mustache.render(templates[inTemplateId], inTemplatesData);
    },
  };
})();
