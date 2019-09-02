///////////////////////////////////////////////////////////////////////////////
//  File:       TopActivitySummary.js
//  Project:    Qustodio Family Portal
//  Company:    Evolium
//  Author:     Francesco Carrella (francesco.carrella@evolium.com)
//  Created:    2011-05-12
///////////////////////////////////////////////////////////////////////////////

QFP.Modules.TopActivitySummary = (function() {
  var default_options = {
    // Default values
  };

  var top_activity_list, top_activity_chart_container, top_activity_chart, chart_serie;

  function init() {
    top_activity_list = $('#top-activity-summary-list');
    top_activity_chart_container = $('#top-activity-summary-chart');
    chart_serie = [];

    $('tr', top_activity_list).each(function(index) {
      var row = $(this);
      var title_el = $('h5', row);
      var color_el = $('.color div', row);

      var percent = parseFloat(row.attr('percent'));

      title_el.hyperElement({
        context: QFP.Run.ViewName,
      });
      color_el.css('background', QFP.Definitions.LegendColors[index]);

      chart_serie.push({
        y: percent,
        color: QFP.Definitions.LegendColors[index],
      });
    });

    createChart(chart_serie);

    $('h5 .hyper_element', top_activity_list).each(function(index, el) {
      var title = $(el);
      title.hover(
        function() {
          top_activity_chart.series[0].data[index].select(true);
        },
        function() {
          top_activity_chart.series[0].data[index].select(false);
        }
      );
    });
  }

  function createChart(chart_serie) {
    // calculate "remaining" value: remaining value to 100%
    remaining_to_percent = 100;
    $.each(chart_serie, function(index, point) {
      remaining_to_percent -= point.y;
    });

    if (remaining_to_percent > 0) {
      chart_serie.push({
        id: 'others',
        name: 'others',
        y: remaining_to_percent,
        //color:'transparent'
        //color:'#C0B9AE'
        color: '#A49B90',
        events: {
          mouseOver: function() {
            $('[isTracker="' + this.tracker.isTracker + '"][d="' + this.tracker.d + '"]').css(
              'cursor',
              'default'
            );
          },
        },
      });
    }

    //create chart
    top_activity_chart = new Highcharts.Chart({
      title: false,
      credits: false,
      tooltip: false,
      chart: {
        renderTo: top_activity_chart_container[0],
        backgroundColor: false,
        borderRadius: 0,
        margins: [0, 0, 0, 0],
        spacingTop: 0,
        spacingRight: 0,
        spacingBottom: 0,
        spacingLeft: 0,
        plotShadow: false,
        shadow: false,
      },
      plotOptions: {
        pie: {
          allowPointSelect: false,
          cursor: 'pointer',
          dataLabels: false,
          size: 188,
          center: [100, 100],
          slicedOffset: 5,
          borderWidth: 0,
          shadow: false,
          states: {
            hover: {
              brightness: 0,
            },
          },
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Browser share',
          data: chart_serie,
        },
      ],
    });

    $('.highcharts-tracker path', top_activity_chart_container).each(function(index, el) {
      var related_hyperelement = $('td.activity h5 .hyper_element', top_activity_list).eq(index);
      $(el).hover(
        function(e) {
          related_hyperelement.trigger('mouseenter');
        },
        function(e) {
          related_hyperelement.trigger('mouseleave');
        }
      );
      $(el).click(function(e) {
        related_hyperelement.trigger('click');
      });
    });
  }

  return {
    init: init,
  };
})();
