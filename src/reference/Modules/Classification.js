///////////////////////////////////////////////////////////////////////////////
//  File:       Classification.js
//  Project:    Qustodio Family Portal
//  Company:    Evolium
//  Author:     Francesco Carrella (francesco.carrella@gmail.com)
//  Created:    2011-02-21
///////////////////////////////////////////////////////////////////////////////

QFP.Modules.Classification = function(el, options) {
  var default_config = {
    // Default values
    url: '',
    list: {
      elId: 'classification_list',
    },
    chart: {
      elId: 'classification_chart',
    },
  };

  var config = {};

  var dom_el;
  var current_index;
  var remaining_percent;

  var html_template =
    '\n<div id="classification_chart"></div>\n<ul id="classification_list" class="clearfix">';

  var list_item_html_template =
    '\n<li class="clearfix">\n<div class="color" style="background: {color}"></div>\n<div class="percent">{percent}</div>\n<div class="name">{html}</div>\n</li>';

  var data = [];

  function init(el, options) {
    $.extend(config, default_config, options); // Merge options with default values

    current_index = 0;
    remaining_percent = 100;

    $(el).each(function() {
      dom_el = $(this);

      // create elements basics HTML Elements;
      dom_el.append(html_template);

      dom_el.list_el = $('#' + config.list.elId, $(this));
      dom_el.chart_el = new Highcharts.Chart({
        chart: {
          renderTo: 'classification_chart',
          backgroundColor: false,
          shadow: '#000',
        },
        colors: QFP.Definitions.LegendColors,
        title: false,
        tooltip: false,
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: false,
          },
        },
        series: [
          {
            type: 'pie',
          },
        ],
        credits: {
          enabled: false,
        },
      });

      if (options.data.length) {
        loadData(options.data);
      } else {
        // Make Ajax call; on success call loadData()
        $.ajax({
          url: config.url,
          dataType: 'json',
          context: $(this),
          success: loadData,
        });
      }
    });
  }

  function loadData(new_data) {
    $.each(new_data, function(index, item_data) {
      addListItem.call($(this), item_data, current_index);

      dom_el.chart_el.series[0].addPoint([item_data.name, item_data.percent], true);

      current_index++;
      remaining_percent = remaining_percent - item_data.percent;
    });

    dom_el.chart_el.series[0].addPoint(['remaining_percent', remaining_percent], true);

    data.push(new_data);
  }

  function addListItem(item_data, index) {
    var new_item = $.tmpl('SummaryClassification_ListItem', item_data).appendTo(dom_el.list_el);

    //var list_item_html = list_item_html_template.replace('{html}',item_data.html).replace('{percent}',item_data.percent).replace('{color}', QFP.Definitions.LegendColors[index]);

    //var new_item = $(list_item_html);
    //dom_el.list_el.append(new_item);

    var related_index = current_index;

    var hyperElement = new QFP.Modules.HyperElement($('.name', new_item), {
      actions: item_data.actions,
      onMouseEnter: function(el) {
        dom_el.chart_el.series[0].data[related_index].select(true);
      },
      onMouseLeave: function(el) {
        dom_el.chart_el.series[0].data[related_index].select(false);
      },
    });
  }

  this.data = data;

  init(el, options);
};
