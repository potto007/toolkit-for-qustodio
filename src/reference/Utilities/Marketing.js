QFP.Utilities.Marketing = (function() {
  function _init() {
    var tracking_domain = '.' + QFP.QInit.Marketing.TrackingDomain,
      uid = QFP.Run.ViewData.UID;
    $.cookie('_mkt_returning', uid, { expires: 365, domain: tracking_domain, path: '/' });
  }

  function newFreeConversionFlyovers() {
    if (QFP.Run.ViewData.License.type != 'LICENSE_FREE') {
      return false;
    }

    var flyover_to_show = getFlyoverToShow();
    return flyover_to_show;
  }

  function getFlyoverToShow() {
    var starting_date = QFP.Run.ViewData.License.start_date,
      flyovers_shown = new_free_conversion_flyovers_shown,
      days_to_wait = 7,
      millis_to_wait = days_to_wait * 86400000,
      flyover_quantity = 6,
      days_between_flyovers = 7;

    var start_day = new Date(starting_date),
      end_day = new Date();

    start_day.setDate(start_day.getDate() + days_to_wait);

    var millis_passed = end_day.getTime() - start_day.getTime(),
      days_passed = Math.floor(millis_passed / 86400000);

    show_flyover = Math.floor(days_passed / days_between_flyovers) % flyover_quantity;

    var current_week_timestamp = getTimestampOfCurrentWeek(),
      flyover_already_shown = checkIfFlyoverAlreadyShown(show_flyover, current_week_timestamp);

    if (flyover_already_shown) {
      return false;
    }

    flyovers_shown[show_flyover] = current_week_timestamp;
    QFP.Controllers.AccountSetup.saveSetting(
      'new_free_conversion_flyovers_shown',
      '[' + flyovers_shown.join(',') + ']'
    );

    return show_flyover + 1;
  }

  function checkIfFlyoverAlreadyShown(flyover, current_week_timestamp) {
    var flyovers_shown = new_free_conversion_flyovers_shown,
      flyover_timestamp = flyovers_shown[show_flyover];

    if (current_week_timestamp == flyover_timestamp) {
      return true;
    }

    return false;
  }

  function getTimestampOfCurrentWeek() {
    var today = new Date();
    var day = today.getDay(),
      diff = today.getDate() - day + (day == 0 ? -6 : 1);

    today.setDate(diff);
    today.setHours(0, 0, 0, 0);

    var final = Math.floor(new Date(today).getTime() / 1000);
    return final;
  }

  function updateUpsellFlyoverRecord(new_amount) {
    if (!Number.isInteger(new_amount) || new_amount < 0) {
      new_amount = 0;
    }
    QFP.Controllers.AccountSetup.saveSetting('upsell_flyover_record', new_amount);
  }

  return {
    init: _init,
    newFreeConversionFlyovers: newFreeConversionFlyovers,
    updateUpsellFlyoverRecord: updateUpsellFlyoverRecord,
  };
})();
