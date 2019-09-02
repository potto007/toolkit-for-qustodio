///////////////////////////////////////////////////////////////////////////////
//  File:	Definitions.js
//  Project:	Qustodio Family Portal
//  Company:    Evolium
//  Author:     Francesco Carrella (francesco.carrella@gmail.com)
//  Created:    2011-02-21
///////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
// Namespaces
////////////////////////////////////////////////////////////////////////////////

// Project namespace
var QFP = {};

// Utility namespace
QFP.Utilities = {};

// Modules namespace
QFP.Modules = {};

// Models  namespace
QFP.Models = {};

// Modals  namespace
QFP.Modals = QFP.Modals || {};

// Modules namespace
QFP.Views = {};

// Widgets namespace
QFP.Widgets = {};

// Controllers namespace
QFP.Controllers = {};
QFP.Controllers.UserInfo = {};
QFP.Controllers.UserRules = {};
QFP.Controllers.Settings = {};
QFP.Controllers.Popup = {};

// Currently running environment
QFP.Run = {};
QFP.Run.ViewData = {};
QFP.Run.Modules = {};

////////////////////////////////////////////////////////////////////////////////
// Common enummerations
////////////////////////////////////////////////////////////////////////////////

QFP.Definitions = {
  LegendColors: [
    '#4572A7',
    '#AA4643',
    '#89A54E',
    '#80699B',
    '#3D96AE',
    '#DB843D',
    '#92A8CD',
    '#A47D7C',
    '#B5CA92',
  ],
  DomainStatus: {
    0: 'no_match',
    1: 'whitelist',
    2: 'time_restriction_quota', // Ran out of navigation time
    3: 'time_restriction_range', // Outsidee of navigation time
    4: 'domain_list_allow',
    5: 'domain_list_block',
    6: 'domain_list_alert',
    7: 'category_block',
    8: 'category_alert',
    9: 'not_allow_unknown_sites',
  },
  DomainCategoriesStatus: {
    0: 'allow',
    1: 'alert',
    2: 'block',
  },
  MaxLengthFields: {
    name: 40,
    surname: 40,
    email: 240,
    password: 30,
    deviceName: 60,
    profileName: 40,
  },
};
