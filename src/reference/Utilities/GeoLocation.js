///////////////////////////////////////////////////////////////////////////////
//  File:   GeoLocation.js
//  Project:    Qustodio Family Portal
//  Company:    Qustodio
//  Author:     Marçal Machado Chaiben (marcal.chaiben@qustodio.com)
//  Created:    2014-01-17
///////////////////////////////////////////////////////////////////////////////

QFP.Utilities.GeoLocation = (function() {
  function init() {
    var self = this;
    $(document).on('click', '.open-geo-location', function() {
      var device_id = $(this).attr('device_id');
      var profile_id = $(this).attr('profile_id');
      var timestamp = $(this).attr('timestamp');
      var location_time = $(this).attr('location_time');
      var location_longitude = $(this).attr('location_longitude');
      var location_latitude = $(this).attr('location_latitude');
      var location_accuracy = $(this).attr('location_accuracy');
      var location_address = $(this).attr('location_address');

      self.showTrackingPopup(
        device_id,
        profile_id,
        timestamp,
        location_time,
        location_longitude,
        location_latitude,
        location_accuracy,
        location_address
      );
    });
  }

  function showTrackingPopup(
    device_id,
    profile_id,
    timestamp,
    location_time,
    location_longitude,
    location_latitude,
    location_accuracy,
    location_address
  ) {
    if (QFP.Run.ViewData.License.type == 'LICENSE_FREE') {
      QFP.Controllers.Layout.Premium.showGenericModal(
        QFP.Run.ViewName,
        'open-geo-location',
        '/popup/free-upgrade'
      );
    } else {
      device_id = device_id == undefined ? '' : device_id;
      profile_id = profile_id == undefined ? '' : profile_id;
      timestamp = timestamp == undefined ? '' : timestamp;
      location_time = location_time == undefined ? '' : location_time;
      location_longitude = location_longitude == undefined ? '' : location_longitude;
      location_latitude = location_latitude == undefined ? '' : location_latitude;
      location_accuracy = location_accuracy == undefined ? '' : location_accuracy;
      location_address = location_address == undefined ? '' : location_address;

      QFP.Controllers.Layout.Notifications.showPopup(
        $.extend(
          {
            href:
              '/popup/tracking?device_id=' +
              device_id +
              '&profile_id=' +
              profile_id +
              '&timestamp=' +
              timestamp +
              '&location_time=' +
              location_time +
              '&location_longitude=' +
              location_longitude +
              '&location_latitude=' +
              location_latitude +
              '&location_accuracy=' +
              location_accuracy +
              '&location_address=' +
              location_address,
          },
          { width: 835, height: 500 }
        )
      );
    }
  }

  function searchTimelineLocationAddress(element, latitude, longitude, key, sensor) {
    key = key == undefined ? QFP.Run.GoogleApiConfiguration_Key : key;
    sensor = sensor == undefined ? QFP.Run.GoogleApiConfiguration_Sensor : sensor;
    // var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+latitude+","+longitude+"&key="+key;
    var url =
      'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude;

    $.ajax({
      url: url,
      type: 'GET',
      async: true,
      success: function(value) {
        if (value.status == 'ZERO_RESULTS') {
          return;
        }
        var fist_result = value.results[0];
        var formatted_address = fist_result.formatted_address;
        if (formatted_address != undefined) {
          $('.hyper_element', element).css('width', '100%');
          $('.text_container', element).html(formatted_address);
        }
        $(element).attr('void_location', 0);
      },
    });
  }

  function searchLocationAddress(element, latitude, longitude, key, sensor) {
    key = key == undefined ? QFP.Run.GoogleApiConfiguration_Key : key;
    sensor = sensor == undefined ? QFP.Run.GoogleApiConfiguration_Sensor : sensor;
    latitude = latitude == undefined ? $(element).attr('location_latitude') : latitude;
    longitude = longitude == undefined ? $(element).attr('location_longitude') : longitude;

    var void_location =
      $(element).attr('void_location') == undefined ? 1 : $(element).attr('void_location');

    if (void_location == 0) return;

    // var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+latitude+","+longitude+"&key="+key;
    var url =
      'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude;

    $.ajax({
      url: url,
      type: 'GET',
      async: true,
      success: function(value) {
        var first_result = value.results[0];
        if (first_result != undefined) {
          if (first_result.formatted_address != undefined) {
            $(element).html(first_result.formatted_address);
          }
        }
        $(element).attr('void_location', 0);
      },
    });
  }

  return {
    showTrackingPopup: showTrackingPopup,
    searchTimelineLocationAddress: searchTimelineLocationAddress,
    searchLocationAddress: searchLocationAddress,
    init: init,
  };
})();
