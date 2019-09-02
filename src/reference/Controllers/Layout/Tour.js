QFP.Controllers.Layout.Tour = (function() {
  var jTourConfig = {
      autoplay: false,
      autostart: true,
      pauseOnHover: false,
      showControls: false,
      // scrollBack: true,
      onChange: onChange,
      onStart: onStart,
      onStop: onStop,
      onFinish: onFinish,
    },
    jTourStepConfig = {
      position: 's',
      offset: 5,
      expose: true,
      overlayOpacity: 0.65,
      onBeforeShow: onBeforeStepShow,
      onHide: onStepHide,
    },
    jTourObj,
    jTourCurrentStep,
    viewsTourStepsConfig = {
      'user-activity.summary': [
        {
          element: '#user_basics .navigation li.summary',
          title: QFP.lng('_strFpTourActivitySummaryTabTitle'),
          html: QFP.lng('_strFpTourActivitySummaryTab'),
        },
        {
          element: '#user_basics .navigation li.social',
          title: QFP.lng('_strFpTourSocialActivityTabTitle'),
          html: QFP.lng('_strFpTourSocialActivityTab'),
        },
        {
          element: '#user_basics .navigation li.web',
          title: QFP.lng('_strFpTourWebActivityTabTitle'),
          html: QFP.lng('_strFpTourWebActivityTab'),
        },
        {
          element: '#user_basics .navigation li.timeline',
          title: QFP.lng('_strFpTourActivityTimelineTabTitle'),
          html: QFP.lng('_strFpTourActivityTimelineTab'),
        },
        {
          element: '#user_basics .navigation li.rules',
          title: QFP.lng('_strFpTourRulesSettingsTabTitle'),
          html: QFP.lng('_strFpTourRulesSettingsTab'),
        },
        {
          element: '#account_info',
          title: QFP.lng('_strFpTourAccountInfoTitle'),
          html: QFP.lng('_strFpTourAccountInfo'),
        },
      ],
    };

  function show(steps, config) {
    config = $.extend({}, jTourConfig, config);

    if (!steps && viewsTourStepsConfig[QFP.Run.ViewName]) {
      steps = viewsTourStepsConfig[QFP.Run.ViewName];
    }

    if (!steps) {
      return false;
    }

    $.each(steps, function(i, step) {
      if (step.title) {
        var title_bar =
          '<h1>' +
          step.title +
          '<span class="progress">' +
          (i + 1) +
          '/' +
          steps.length +
          '</span></h1>';
        step.html = title_bar + step.html;
        delete step.title;
      }
      if (!step.element) {
        step.expose = false;
      }
      steps[i] = $.extend({}, jTourStepConfig, step);
    });

    jTourObj = jTour(steps, config);

    $.ajax({
      url: '/account-setup/save-settings',
      type: 'POST',
      data: {
        option: 'set_dashboard_tour_as_shown',
      },
    });
  }

  function onBeforeStepShow() {
    var jTourCurrentStepConfig = jTourObj.tourdata[jTourCurrentStep];

    var isLastStep = jTourCurrentStep == jTourObj.tourdata.length - 1;

    var jTourContent = $('.jTour_content', jTourObj.box),
      buttonBar = $('<div/>', {
        class: 'button_bar',
      }).appendTo(jTourContent);

    if (!isLastStep) {
      $('<a />', {
        class: 'skip_button',
        click: jTourObj.stop,
        html: QFP.lng('_strFpTourSkip'),
      }).appendTo(buttonBar);
    }

    $('<button />', {
      class: 'next_button small',
      click: jTourObj.next,
      html:
        '<span>' +
        (isLastStep ? QFP.lng('_strWizardFinishButt') : QFP.lng('_strNextButt')) +
        '</span>',
    }).appendTo(buttonBar);

    if (!jTourCurrentStepConfig.element) {
      $('.jTour_arrow').attr('class', 'jTour_arrow c');
    }

    if (jTourCurrentStepConfig.element) {
      var $exposed_el = $(jTourCurrentStepConfig.element);
      $exposed_el.bind('click', disableEvent);
    }
  }

  function onStepHide() {
    var jTourCurrentStepConfig = jTourObj.tourdata[jTourCurrentStep];
    if (jTourCurrentStepConfig.element) {
      var $exposed_el = $(jTourCurrentStepConfig.element);
      $exposed_el.unbind('click', disableEvent);
    }
  }

  function onChange(nextStep) {
    jTourCurrentStep = nextStep;
    if (_gaq && _gaq.push) {
      _gaq.push([
        '_trackEvent',
        'fp-tour-' + QFP.Run.ViewName,
        'step-' + (jTourCurrentStep + 1),
        'v-1',
      ]);
    }
  }

  function onStart() {
    if (_gaq && _gaq.push) {
      _gaq.push(['_trackEvent', 'fp-tour-' + QFP.Run.ViewName, 'start', 'v-1']);
    }
  }

  function onStop() {
    if (_gaq && _gaq.push) {
      _gaq.push([
        '_trackEvent',
        'fp-tour-' + QFP.Run.ViewName,
        'stop-' + (jTourCurrentStep + 1),
        'v-1',
      ]);
    }
    QFP.Controllers.Layout.Notifications.getAll();
  }

  function onFinish() {
    if (_gaq && _gaq.push) {
      _gaq.push(['_trackEvent', 'fp-tour-' + QFP.Run.ViewName, 'finish', 'v-1']);
    }
  }

  function close() {
    if (jTourObj && jTourObj.stop) {
      jTourObj.stop();
    }
  }

  function disableEvent(e) {
    e.preventDefault();
    return false;
  }

  return {
    show: show,
    close: close,
  };
})();
