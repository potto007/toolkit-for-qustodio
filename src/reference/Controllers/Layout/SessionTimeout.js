QFP.Controllers.Layout.SessionTimeout = (function() {
  var config = {
    loopTime: 1,
    checkTime: 60,
    logoutUrl: '/account-auth/logout/reason/',
    logoutUrlReasonParam: {
      1: 'session-expired',
      2: 'programmed-upgrade',
    },
    refreshTimeBeforeNotification: 10,
    notifications: {
      1: {
        times: [30, 60, 120],
        tag: '_strNotifSessionTimeoutInXTime',
        id: 'SessionTimeout',
      },
      2: {
        times: [30, 60, 120],
        tag: '_strNotifProgrammedUpgradeInXTime',
      },
    },
  };

  var vars = {};

  function init() {
    $.ajax({
      url: '/account-auth/ajax',
      type: 'POST',
      data: {
        option: 'get_expiration_time',
      },
      success: function(result) {
        if (result.reason != 0) {
          vars.remain_time = result.time;
          vars.reason = result.reason;
          startTimers();
        }
      },
    });
  }

  function loop() {
    if (vars.remain_time !== undefined && vars.reason !== undefined) {
      vars.remain_time = vars.remain_time - config.loopTime;

      // get remaining time if
      //      - it's 0
      //      - it's 10 seconds before one of notifications times.
      if (
        vars.remain_time <= 0 ||
        $.inArray(
          vars.remain_time - config.refreshTimeBeforeNotification,
          config.notifications[vars.reason].times
        ) != -1
      ) {
        getRemainTime();
      }

      loopChekcs(vars.remain_time);
    } else {
      getRemainTime();
    }
  }

  function loopChekcs(remain_time) {
    if ($.inArray(remain_time, config.notifications[vars.reason].times) != -1) {
      QFP.Controllers.Layout.Notifications.show({
        id: config.notifications[vars.reason].id || '',
        textTag: config.notifications[vars.reason].tag,
        languageParams: {
          _time: QFP.Utilities.DateTime.convertSecondsToString(remain_time, true),
        },
      });
    }
  }

  function getRemainTime() {
    $.ajax({
      url: '/account-auth/ajax',
      type: 'POST',
      data: {
        option: 'get_expiration_time',
      },
      success: function(result) {
        var old_remain_time = vars.remain_time;
        vars.remain_time = result.time;

        // If the time is 0, redirect get user logeed out and redirect him to login page
        if (vars.remain_time <= 0) {
          stopTimers();
          window.top.location = config.logoutUrl + config.logoutUrlReasonParam[vars.reason];
        } else {
          vars.reason = result.reason;

          // if the resulted time is minor of old remain_time, execute loopChekcs() for all intermediate values.
          // We'll not lose any step!
          for (old_remain_time; vars.remain_time < old_remain_time; old_remain_time--) {
            loopChekcs(old_remain_time - 1);
          }
        }
      },
    });
  }

  function setRemainingTime(remain_time) {
    vars.remain_time = remain_time;
  }

  function startTimers() {
    try {
      $(document).everyTime(config.loopTime * 1000, 'sessiontimeout_loop', loop);
      $(document).everyTime(config.checkTime * 1000, 'sessiontimeout_checktime', getRemainTime);
    } catch (err) {}
  }

  function stopTimers() {
    $(document).stopTime('sessiontimeout_loop');
    $(document).stopTime('sessiontimeout_checktime');
  }

  return {
    init: init,
    setRemainingTime: setRemainingTime,
    vars: vars,
  };
})();

$(QFP.Controllers.Layout.SessionTimeout.init);
