///////////////////////////////////////////////////////////////////////////////
//  File:	DateTime.js
//  Project:	Qustodio Family Portal
//  Company:    Evolium
//  Author:     Francesco Carrella (francesco.carrella@evolium.com)
//  Created:    2011-05-04
//  Based on:   HightChart date manipulation (www.highcharts.com)
///////////////////////////////////////////////////////////////////////////////

QFP.Utilities.DateTime = (function() {
  // Global vars

  var useUTC = true,
    timeFactor = 1, // 1 = JavaScript time, 1000 = Unix time;
    // time methods, changed based on whether or not UTC is used
    makeTime,
    getMinutes,
    getHours,
    getDay,
    getDate,
    getMonth,
    getFullYear,
    setMinutes,
    setHours,
    setDate,
    setMonth,
    setFullYear,
    // Localization
    languageTags = {
      months: [
        '_strJanuary',
        '_strFebruary',
        '_strMarch',
        '_strApril',
        '_strMay',
        '_strJune',
        '_strJuly',
        '_strAugust',
        '_strSeptember',
        '_strOctober',
        '_strNovember',
        '_strDecember',
      ],
      weekdays: [
        '_strSunday',
        '_strMonday',
        '_strTuesday',
        '_strWednesday',
        '_strThursday',
        '_strFriday',
        '_strSaturday',
      ],
      lastWeekdays: [
        '_strLastSunday',
        '_strLastMonday',
        '_strLastTuesday',
        '_strLastWednesday',
        '_strLastThursday',
        '_strLastFriday',
        '_strLastSaturday',
      ],
    };

  /**
   * Return a 2 digit string from passed number (ej. 1 -> 01 )
   * * @param {Number} number
   * * @return {String}
   */
  function pad(number) {
    return number.toString().replace(/^([0-9])$/, '0$1');
  }

  /**
   * Set the time methods globally based on the useUTC option. Time method can be either
   * local time or UTC (default).
   */
  function setTimeMethods() {
    makeTime = useUTC
      ? Date.UTC
      : function(year, month, date, hours, minutes, seconds) {
          return new Date(year, month, date || 1, hours || 0, minutes || 0, seconds || 0).getTime();
        };
    getMinutes = useUTC ? 'getUTCMinutes' : 'getMinutes';
    getHours = useUTC ? 'getUTCHours' : 'getHours';
    getDay = useUTC ? 'getUTCDay' : 'getDay';
    getDate = useUTC ? 'getUTCDate' : 'getDate';
    getMonth = useUTC ? 'getUTCMonth' : 'getMonth';
    getFullYear = useUTC ? 'getUTCFullYear' : 'getFullYear';
    setMinutes = useUTC ? 'setUTCMinutes' : 'setMinutes';
    setHours = useUTC ? 'setUTCHours' : 'setHours';
    setDate = useUTC ? 'setUTCDate' : 'setDate';
    setMonth = useUTC ? 'setUTCMonth' : 'setMonth';
    setFullYear = useUTC ? 'setUTCFullYear' : 'setFullYear';
  }

  /**
   * Method to externally set UTC flag and update TimeMethods
   * * @param {Bool} utc_value
   */
  function setUTC(utc_value) {
    UTC = utc_value;
    setTimeMethods();
  }

  /**
   * Based on http://www.php.net/manual/en/function.strftime.php
   * @param {String} format
   * @param {Number} timestamp
   * @param {Boolean} capitalize
   * @return {String}
   */
  formatDate = function(format, timestamp, capitalize) {
    var language = QFP.Run.ViewData.Locale;

    if (!timestamp) {
      return 'Invalid date';
    }

    if (format != undefined) {
      switch (format) {
        case 'date_long':
          switch (language) {
            case 'en':
              format = '%A, %B %e';
              break;
            case 'es':
              format = '%A, %e de %B';
              break;
            case 'fr':
              format = '%A %e %B';
              break;
            case 'it':
              format = '%A, %e %B';
              break;
            case 'pt_BR':
              format = '%A, %e de %B';
              break;
            default:
              format = '%A, %B %e';
          }
          break;
      }
    } else {
      format = '%Y-%m-%d %H:%M:%S';
    }

    var date = new Date(timestamp * timeFactor),
      // get the basic time values
      hours = date[getHours](),
      day = date[getDay](),
      dayOfMonth = date[getDate](),
      month = date[getMonth](),
      fullYear = date[getFullYear](),
      langWeekdays = languageTags.weekdays,
      langMonths = languageTags.months;

    // list all format keys
    var replacements = {
      // Day
      a: QFP.lng(langWeekdays[day]).substr(0, 3), // Short weekday, like 'Mon'
      A: QFP.lng(langWeekdays[day]), // Long weekday, like 'Monday'
      d: pad(dayOfMonth), // Two digit day of the month, 01 to 31
      e: dayOfMonth, // Day of the month, 1 through 31

      // Week (none implemented)

      // Month
      b: QFP.lng(langMonths[month]).substr(0, 3), // Short month, like 'Jan'
      B: QFP.lng(langMonths[month]), // Long month, like 'January'
      m: pad(month + 1), // Two digit month number, 01 through 12

      // Year
      y: fullYear.toString().substr(2, 2), // Two digits year, like 09 for 2009
      Y: fullYear, // Four digits year, like 2009

      // Time
      h: hours, // hours in 24h format, 0 through 23
      H: pad(hours), // Two digits hours in 24h format, 00 through 23
      i: hours % 12 || 12, // 12h format, 0 through 11
      I: pad(hours % 12 || 12), // Two digits hours in 12h format, 00 through 11
      l: hours % 12 || 12, // Hours in 12h format, 1 through 12
      M: pad(date[getMinutes]()), // Two digits minutes, 00 through 59
      p: hours < 12 ? 'AM' : 'PM', // Upper case AM or PM
      P: hours < 12 ? 'am' : 'pm', // Lower case AM or PM
      S: pad(date.getSeconds()), // Two digits seconds, 00 through  59
    };

    // do the replaces
    for (var key in replacements) {
      if (replacements.hasOwnProperty(key)) {
        format = format.replace('%' + key, replacements[key]);
      }
    }

    // Optionally capitalize the string and return
    return capitalize ? format.substr(0, 1).toUpperCase() + format.substr(1) : format;
  };

  /**
   * get the weekday name of passed date, eventually trimmed
   * @param {Number} timestamp
   * @param {Number} trimAt
   * @return {String}
   */
  function getWeekdayName(timestamp, trimAt) {
    var date = new Date(timestamp * timeFactor),
      day = date[getDay](),
      weekday = QFP.lng(languageTags.weekdays[day]);

    return trimAt ? weekday.substr(0, trimAt) : weekday;
  }

  /**
   * get the "friendly" name of passed date, ex. Today, Yesterday, Last Monday, Octuber 20, etc
   * @param {Number} timestamp
   * @param {Boolean} withYear
   * @return {String}
   */
  function getDayName(timestamp, withYear) {
    var one_day = 1000 * 60 * 60 * 24,
      date = new Date(timestamp * timeFactor),
      today = new Date(),
      day_from_today = Math.ceil((today.getTime() - date.getTime()) / one_day);

    if (day_from_today == 1) {
      return QFP.lng('_strToday');
    } else if (day_from_today == 2) {
      return QFP.lng('_strYesterday');
    } else if (day_from_today < 7) {
      return QFP.lng(languageTags.lastWeekdays[day_from_today]);
    } else {
      return formatDate(withYear ? '%A %B %e %Y' : '%A %B %e', timestamp);
    }
  }

  /**
   * Convert number of hours to a string with corresponding hours:minutes (ex. 4.5 -> 4:30)
   * @param {Number}
   * @return {String}
   */
  function convertNumberToHours(number) {
    var hours = Math.floor(number),
      minutes = Math.round((60 / 1) * (number - hours));
    return hours + ':' + pad(minutes);
  }

  /**
   * Convert number of seconds to a string with corresponding minutes:seconds (ex. 270 -> 4:30 minutes)
   * If @inAbout param is true,
   * @param {Number}
   * @param {Boolean}
   * @return {String}
   */
  function convertSecondsToString(number, about) {
    var minutes = Math.floor(number / 60),
      seconds = number - minutes * 60;
    if (about) {
      if (minutes > 0) {
        return minutes + ' ' + QFP.lng('_strMinutes');
      } else {
        return seconds + ' ' + QFP.lng('_strSeconds');
      }
    } else {
      return minutes + ':' + pad(seconds) + ' ' + QFP.lng('_strMinutes');
    }
  }

  /**
   * Convert number of minutes to a string with corresponding hours:minutes (ex. 270 -> 4:30 minutes)
   * If @inAbout param is true, ???
   * @param {Number}
   * @param {Boolean}
   * @return {String}
   */
  function convertMinutesToString(number, abbr, about) {
    var hours = Math.floor(number / 60),
      minutes = number - hours * 60;
    if (about) {
      if (hours > 0) {
        return hours + ' ' + QFP.lng(abbr ? '_strHoursAbbr' : '_strHours');
      } else {
        return minutes + ' ' + QFP.lng(abbr ? '_strMinutesAbbr' : '_strMinutes');
      }
    } else {
      if (hours > 0) {
        return hours + ':' + pad(minutes) + ' ' + QFP.lng(abbr ? '_strHoursAbbr' : '_strHours');
      } else {
        return minutes + ' ' + QFP.lng(abbr ? '_strMinutesAbbr' : '_strMinutes');
      }
    }
  }

  /**
   * Return a new date with added or removed days from a passed date
   * @param {Date} myDate
   * @param {Number} days
   * @return {Date}
   */
  function addDays(myDate, days) {
    return new Date(myDate.getTime() + days * 24 * 60 * 60 * 1000);
  }

  /**
   * Return a difference of days between two dates
   * @param {Date} date1
   * @param {Date} date2
   * @return {Number}
   */
  function diffDays(date1, date2) {
    return Math.floor(
      (Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate()) -
        Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate())) /
        (1000 * 60 * 60 * 24)
    );
  }

  //  INIT on document ready
  $(function() {
    setTimeMethods();
  });

  return {
    setUTC: setUTC,

    makeTime: makeTime,
    formatDate: formatDate,
    convertNumberToHours: convertNumberToHours,
    getDayName: getDayName,
    getWeekdayName: getWeekdayName,
    convertSecondsToString: convertSecondsToString,
    convertMinutesToString: convertMinutesToString,
    addDays: addDays,
    diffDays: diffDays,
  };
})();
