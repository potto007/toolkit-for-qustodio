///////////////////////////////////////////////////////////////////////////////
//  File:       TimelineChart.js
//  Project:    Qustodio Family Portal
//  Company:    Evolium
//  Author:     Francesco Carrella (francesco.carrella@gmail.com)
//  Created:    2011-02-21
///////////////////////////////////////////////////////////////////////////////
QFP.Modules.TimelineChart = (function() {
  var chart,
    chart_premium_mask,
    data_length,
    license_max_days,
    default_options = {
      // Default values
      renderTo: 'timeline_chart',
    };

  function init(end_date, data, in_license_max_days, options) {
    end_date = new Date(end_date.replace(/-/g, '/'));

    var date_offset = end_date.getTimezoneOffset() * 60 * 1000;

    data_length = data.length;
    license_max_days = in_license_max_days;

    var config = $.extend({}, default_options, options); // Merge options with default values
    // Define basics vars
    var data_interval = 24 * 3600 * 1000,
      // a day
      last_day = QFP.Utilities.DateTime.addDays(end_date, +1).getTime() - date_offset,
      first_day = QFP.Utilities.DateTime.addDays(new Date(last_day), -1 * data_length).getTime(),
      unselected_serie = [],
      selected_serie = [],
      point_states = [],
      point_restrictions = [],
      total_enabled_points = 0,
      point_index = 0;

    $.each(data, function(index, item) {
      if (item.enabled) total_enabled_points++;
    });

    // For each itam in data, put the relative value into enabled/disabled series
    var previous_state = data[0].enabled;
    $.each(data, function(index, item) {
      var state_changed = item.enabled != previous_state;
      selected_serie.push(item.enabled || state_changed ? item.value : null);
      unselected_serie.push(item.value);
      point_states.push(item.enabled);
      point_restrictions.push(index < license_max_days);
      previous_state = total_enabled_points == 1 ? false : item.enabled;
    });

    var tmp_context = this;

    // Create chart!
    chart = new Highcharts.Chart({
      title: false,
      legend: false,
      credits: false,
      chart: {
        renderTo: config.renderTo,
        defaultSeriesType: 'line',
        backgroundColor: false,
        borderRadius: 0,
        spacingTop: 15,
        spacingRight: 10,
        spacingBottom: 10,
        spacingLeft: 10,
        events: {
          load: createPremiumMask,
        },
      },
      plotOptions: {
        line: {
          color: '#FFF',
          cursor: 'pointer',
          stickyTracking: false,
          marker: {
            enabled: false,
            symbol: 'circle',
            radius: 5,
            states: {
              hover: {
                enabled: true,
                fillColor: '#4A87AB',
                lineWidth: 2,
              },
            },
          },
          point: {
            events: {
              click: function() {
                var clicked_day = parseInt(
                    data_length - 1 - (this.x - first_day) / data_interval,
                    10
                  ),
                  // = day 0, 1, 2, 3, etc
                  restricted = point_restrictions[clicked_day];

                if (restricted) {
                  // Get current url path, remove the day/days parameter and -eventually- remove the last "/" char
                  var current_url = window.location.pathname.replace(/\/day(s?)\/\d*/g, '');
                  if (current_url.charAt(current_url.length - 1) == '/') {
                    current_url = current_url.substr(0, current_url.length - 1);
                  }

                  //redirect to new url - adding day param.
                  window.location = current_url + '/day/' + clicked_day + '/';
                } else {
                  QFP.Controllers.Layout.Premium.showOffer(QFP.Run.ViewName, 'timegraph');
                  return false;
                }
              },
            },
          },
        },
      },
      xAxis: {
        type: 'datetime',
        lineWidth: 0,
        tickWidth: 0,
        tickPixelInterval: 30,
        tickmarkPlacement: 'on',
        labels: {
          formatter: function() {
            if (point_index + 1 > data.length) {
              point_index = 0;
            }

            var style = point_states[point_index] ? 'color:#FFF; font-weight: bold;' : '';
            point_index++;

            var week_day = QFP.Utilities.DateTime.getWeekdayName(this.value, 1);
            return '<span style="' + style + '">' + week_day + '</span>';
          },
          style: {
            color: '#999',
          },
        },
        gridLineWidth: 1,
        gridLineColor: '#999999',
      },
      yAxis: {
        title: false,
        gridLineWidth: 0,
        tickPixelInterval: 35,
        min: 0,
        labels: {
          formatter: function() {
            return this.value + ' ' + QFP.lng('_strHours');
          },
          style: {
            fontSize: '9px',
            color: '#FFF',
          },
        },
      },
      tooltip: {
        formatter: function() {
          var date_timestamp = this.x,
            date_delta = date_timestamp - first_day,
            day_number = parseInt(data_length - 1 - date_delta / data_interval, 10),
            day_enabled = day_number < license_max_days,
            html = QFP.lng('_strOnXXOnlineForXXHours', {
              rep_date: QFP.Utilities.DateTime.formatDate('date_long', date_timestamp),
              rep_hours: QFP.Utilities.DateTime.convertNumberToHours(this.y),
            });

          return html;
        },
        backgroundColor: 'transparent',
        borderWidth: 0,
        useHTML: true,
        shadow: false,
      },
      series: [
        {
          data: unselected_serie,
          pointStart: first_day,
          pointInterval: data_interval,
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1,
            },
          },
          shadow: false,
          showInLegend: false,
          color: '#999999',
          enableMouseTracking: true,
        },
        {
          data: selected_serie,
          pointStart: first_day,
          pointInterval: data_interval,
          lineWidth: 3,
          states: {
            hover: {
              lineWidth: 3,
            },
          },
          marker: {
            enabled: total_enabled_points == 1,
          },
        },
      ],
    });
  }

  function createPremiumMask() {
    var chart = this,
      masked_days = data_length - license_max_days;

    if (masked_days <= 0) {
      return;
    }

    chart_premium_mask = $(
      QFP.Utilities.Templates.render('useractivity_timeline_premium_timerange_mask')
    )
      .css({
        width: (chart.xAxis[0].len / data_length) * masked_days,
        left: chart.xAxis[0].left,
      })
      .appendTo(chart.container);

    chart_premium_mask.on({
      mouseenter: function() {
        showPremiumMask(true);
      },
      mouseleave: function() {
        showPremiumMask(false);
      },
      click: function() {
        QFP.Controllers.Layout.Premium.showOffer(QFP.Run.ViewName, 'timegraph');
        return false;
      },
    });
  }

  function showPremiumMask(show) {
    if (chart_premium_mask) {
      chart_premium_mask.stop(true).animate({
        opacity: show ? 0.9 : 0.65,
      });

      $('a, p', chart_premium_mask)
        .stop(true)
        .animate({
          opacity: show ? 1 : 0,
        });
    }
  }

  return {
    init: init,
    showPremiumMask: showPremiumMask,
  };
})();
