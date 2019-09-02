/**
 * SegmentIO event names
 */
const EVENT_CLICKED_RULES = 'Clicked Rules';
const EVENT_OPEN_FP = 'Opened Family Portal';
const EVENT_OPT_IN_PAR_WEB = 'Opt-in Par Web';

// User Rules events
// Web Rules events
const EVENT_SETUP_RULE_WEB = 'Setup Rule Web';
const EVENT_ENABLE_CATEGORY_RESTRICTIONS = 'enable_website_category_restrictions';
const EVENT_DISABLE_CATEGORY_RESTRICTIONS = 'disable_website_category_restrictions';
const EVENT_BLOCK_CATEGORY = 'block_category';
const EVENT_ALLOW_CATEGORY = 'allow_category';
const EVENT_IGNORE_CATEGORY = 'ignore_category';
const EVENT_ALERT_CATEGORY = 'alert_category';
const EVENT_WEBSITE_EXCEPTION_CHANGE = 'website_exception_change';
const EVENT_ALLOW_UNCATEGORIZED_WEBSITES = 'allow_uncategorized_websites';
const EVENT_DISALLOW_UNCATEGORIZED_WEBSITES = 'disallow_uncategorized_websites';
const EVENT_ENABLE_SAVE_SEARCH = 'enable_safe_search';
const EVENT_DISABLE_SAVE_SEARCH = 'disable_safe_search';
const EVENT_ENABLE_REPORT_BLOCKED_SITES_ALERT = 'enable_blocked_sites_notification';
const EVENT_DISABLE_REPORT_BLOCKED_SITES_ALERT = 'disable_blocked_sites_notification';
// Time limits
const EVENT_SETUP_RULE_TIME = 'Setup Rule Time';
const EVENT_ENABLE_SCHEDULE = 'enable_schedule';
const EVENT_DISABLE_SCHEDULE = 'disable_schedule';
const EVENT_TIME_SCHEDULE_CHANGE = 'time_schedule_change';
const EVENT_TIME_LIMITS_CHANGE = 'time_limits_change';
const EVENT_ENABLE_LOCK_NAVIGATION = 'enable_lock_navigation';
const EVENT_DISABLE_LOCK_NAVIGATION = 'disable_lock_navigation';
const EVENT_ENABLE_LOCK_DEVICE = 'enable_lock_device';
const EVENT_DISABLE_LOCK_DEVICE = 'disable_lock_device';
const EVENT_ENABLE_ALERT_ME = 'enable_alert_me';
const EVENT_DISABLE_ALERT_ME = 'disable_alert_me';
const EVENT_ENABLE_SCHEDULE_BY_DEVICE = 'enable_schedule_by_device';
const EVENT_DISABLE_SCHEDULE_BY_DEVICE = 'disable_schedule_by_device';
// Social monitoring
const EVENT_SETUP_RULE_SOCIAL = 'Setup Rule Social';
const EVENT_ENABLE_SOCIAL_MONITORING = 'enable_social_monitoring';
const EVENT_DISABLE_SOCIAL_MONITORING = 'disable_social_monitoring';
// Location
const EVENT_SETUP_LOCATION_RULE = 'Setup Location Rule';
const EVENT_ENABLE_LOCATION_MONITORING = 'enable_location_monitoring';
const EVENT_DISABLE_LOCATION_MONITORING = 'disable_location_monitoring';
// Panic button
const EVENT_SETUP_PANIC_BUTTON = 'Setup Rule Panic Button';
const EVENT_ENABLE_PANIC_BUTTON = 'enable_panic_button';
const EVENT_DISABLE_PANIC_BUTTON = 'disable_panic_button';

// Calls & SMS
const EVENT_SETUP_CALLS_SMS = 'Setup Rule Calls and SMS';
const EVENT_ENABLE_CALLS_SMS_MONITORING = 'enable_calls_and_sms_monitoring';
const EVENT_DISABLE_CALLS_SMS_MONITORING = 'disable_calls_and_sms_monitoring';
const EVENT_ENABLE_REPORT_CONTENT = 'enable_report_content';
const EVENT_DISABLE_REPORT_CONTENT = 'disable_report_content';
const EVENT_ENABLE_BLOCK_INCOMING_CALLS = 'enable_block_all_incoming_calls';
const EVENT_DISABLE_BLOCK_INCOMING_CALLS = 'disable_block_all_incoming_calls';
const EVENT_ENABLE_BLOCK_OUTGOING_CALLS = 'enable_block_all_outgoing_calls';
const EVENT_DISABLE_BLOCK_OUTGOING_CALLS = 'disable_block_all_outgoing_calls';
const EVENT_INDIVIDUAL_PHONE_CHANGES = 'individual_phone_numbers_change';
var EVENT_CLICKED_TIMELINE_CARD = 'Clicked Timeline Card';
// youtube rules
var EVENT_VIDEO_SETUP_RULES = 'Setup Rule Block Video Platforms';
// video blocking
var EVENT_VIDEO_SETUP_BLOCK_VIDEO = 'Setup Rule Block Particular Video';

var EVENT_TYPES = {
  APP: 301,
  PANIC: 500,
  WEB: 101,
  SEARCH: 103,
  LOCATION: 400,
  LOCATION_UNAVAILABLE: 401,
  LAST_LOCATION: 402,
  CALLS_INCOMING: 280,
  CALLS_OUTGOING: 281,
  CALLS_MISSED: 282,
  CALLS_UNANSWERED: 283,
  CALLS_BLOCKED_INCOMING: 286,
  CALLS_BLOCKED_OUTGOING: 287,
  SMS_INCOMING: 284,
  SMS_OUTGOING: 285,
  SMS_BLOCKED_INCOMING: 288,
  SMS_BLOCKED_OUTGOING: 289,
  TWITTER: 1,
  FACEBOOK_SOCIAL: 200,
  FACEBOOK_SOCIAL_CONTACT: 201,
  FACEBOOK_SOCIAL_NETWORK: 202,
  FACEBOOK_SOCIAL_CONTACT_NEW: 210,
  FACEBOOK_SOCIAL_ACTIVITY: 220,
  FACEBOOK_SOCIAL_ACTIVITY_POST: 230,
  FACEBOOK_SOCIAL_ACTIVITY_USER_POST: 221,
  FACEBOOK_SOCIAL_ACTIVITY_USER_PROFILE: 222,
  FACEBOOK_SOCIAL_ACTIVITY_USER_COMMENT: 223,
  FACEBOOK_SOCIAL_ACTIVITY_USER_LIKE: 224,
  FACEBOOK_SOCIAL_ACTIVITY_USER_EVENT: 225,
  FACEBOOK_SOCIAL_ACTIVITY_CONTACT_POST: 226,
  FACEBOOK_SOCIAL_ACTIVITY_CONTACT_COMMENT: 227,
  FACEBOOK_SOCIAL_ACTIVITY_CONTACT_LIKE: 228,
  FACEBOOK_SOCIAL_ACTIVITY_USER_CONTACT_POST: 229,
  FACEBOOK_SOCIAL_ACTIVITY_USER_LINK: 231,
  FACEBOOK_SOCIAL_ACTIVITY_USER_SHARE_PHOTO: 232,
  FACEBOOK_SOCIAL_MEDIA: 270,
  FACEBOOK_SOCIAL_MEDIA_USER_PHOTO: 271,
  FACEBOOK_SOCIAL_MEDIA_USER_VIDEO: 272,
  FACEBOOK_SOCIAL_MEDIA_CONTACT_PHOTO: 273,
  FACEBOOK_SOCIAL_MEDIA_CONTACT_VIDEO: 274,
};

var SegmentEventTypeEnum = {
  website: 'website',
  call: 'call',
  sms: 'sms',
  location: 'location',
  panic: 'panicbtn',
  search: 'search',
  facebook: 'facebook',
  generic: 'generic',
  twitter: 'twitter',
  app: 'app',
  youtube: 'youtube',
};

var getSegmentEventType = function(type, subtype) {
  switch (type) {
    case EVENT_TYPES.APP:
      return SegmentEventTypeEnum.app;
    case EVENT_TYPES.WEB:
      if (subtype === -666) return SegmentEventTypeEnum.youtube;
      return SegmentEventTypeEnum.website;
    case EVENT_TYPES.CALLS_INCOMING:
    case EVENT_TYPES.CALLS_OUTGOING:
    case EVENT_TYPES.CALLS_MISSED:
    case EVENT_TYPES.CALLS_UNANSWERED:
    case EVENT_TYPES.CALLS_BLOCKED_INCOMING:
    case EVENT_TYPES.CALLS_BLOCKED_OUTGOING:
      return SegmentEventTypeEnum.call;
    case EVENT_TYPES.SMS_INCOMING:
    case EVENT_TYPES.SMS_OUTGOING:
    case EVENT_TYPES.SMS_BLOCKED_INCOMING:
    case EVENT_TYPES.SMS_BLOCKED_OUTGOING:
      return SegmentEventTypeEnum.sms;
    case EVENT_TYPES.LOCATION:
    case EVENT_TYPES.LOCATION_UNAVAILABLE:
    case EVENT_TYPES.LAST_LOCATION:
      return SegmentEventTypeEnum.location;
    case EVENT_TYPES.VENT_PANIC:
      return SegmentEventTypeEnum.panic;
    case EVENT_TYPES.SEARCH:
      return SegmentEventTypeEnum.search;
    case EVENT_TYPES.FACEBOOK_SOCIAL:
    case EVENT_TYPES.FACEBOOK_SOCIAL_CONTACT:
    case EVENT_TYPES.FACEBOOK_SOCIAL_NETWORK:
    case EVENT_TYPES.FACEBOOK_SOCIAL_CONTACT_NEW:
    case EVENT_TYPES.FACEBOOK_SOCIAL_ACTIVITY:
    case EVENT_TYPES.FACEBOOK_SOCIAL_ACTIVITY_POST:
    case EVENT_TYPES.FACEBOOK_SOCIAL_ACTIVITY_USER_POST:
    case EVENT_TYPES.FACEBOOK_SOCIAL_ACTIVITY_USER_PROFILE:
    case EVENT_TYPES.FACEBOOK_SOCIAL_ACTIVITY_USER_COMMENT:
    case EVENT_TYPES.FACEBOOK_SOCIAL_ACTIVITY_USER_LIKE:
    case EVENT_TYPES.FACEBOOK_SOCIAL_ACTIVITY_USER_EVENT:
    case EVENT_TYPES.FACEBOOK_SOCIAL_ACTIVITY_CONTACT_POST:
    case EVENT_TYPES.FACEBOOK_SOCIAL_ACTIVITY_CONTACT_COMMENT:
    case EVENT_TYPES.FACEBOOK_SOCIAL_ACTIVITY_CONTACT_LIKE:
    case EVENT_TYPES.FACEBOOK_SOCIAL_ACTIVITY_USER_CONTACT_POST:
    case EVENT_TYPES.FACEBOOK_SOCIAL_ACTIVITY_USER_LINK:
    case EVENT_TYPES.FACEBOOK_SOCIAL_ACTIVITY_USER_SHARE_PHOTO:
    case EVENT_TYPES.FACEBOOK_SOCIAL_MEDIA:
    case EVENT_TYPES.FACEBOOK_SOCIAL_MEDIA_USER_PHOTO:
    case EVENT_TYPES.FACEBOOK_SOCIAL_MEDIA_CONTACT_PHOTO:
      return SegmentEventTypeEnum.facebook;
    case EVENT_TYPES.TWITTER:
      return SegmentEventTypeEnum.twitter;
    default:
      return SegmentEventTypeEnum.generic;
  }
};

var EVENT_VIDEO_SETUP_RULES_NAMES = {
  webEnabled: 'web_enabled',
  webDisabled: 'web_disabled',
  androidEnabled: 'android_enabled',
  androidDisabled: 'android_disabled',
};

var EVENT_VIDEO_SETUP_SOURCES = {
  youtube: 'youtube',
};

var EVENT_VIDEO_SETUP_BLOCK_ACTIONS = {
  unblocked: 'unblocked',
  blocked: 'blocked',
};

var EVENT_VIDEO_SETUP_PLATFORMS = {
  youtube: 'youtube',
};
/**
 * Dictionary { [View Name] : [Segment page event name]}
 */
const pageTrackingDic = {
  'user-activity.summary': 'Viewed Profile Activity',
};

/**
 * SegmentIO helpers
 */
const safeFn = function(fn) {
  return function() {
    try {
      fn.apply(null, arguments);
    } catch (err) {
      if (window.Sentry && window.Sentry.captureException) {
        try {
          window.Sentry.captureException(err);
        } catch (sentryErr) {
          console.error(sentryErr);
        }
      }
    }
  };
};

/**
 * SegmentIO helpers
 */
const segmentPage = safeFn(function(name, properties) {
  if (QFP.QInit.Dashboard.Segment.Enabled) {
    window.analytics.page(name, properties);
  }
});

const segmentTrack = safeFn(function(name, properties) {
  if (QFP.QInit.Dashboard.Segment.Enabled) {
    window.analytics.track(name, properties);
  }
});

const segmentTrackWebRules = function(ruleName) {
  segmentTrack(EVENT_SETUP_RULE_WEB, { rule_name: ruleName });
};

const checkPageTracking = function(viewName) {
  // Send page event if viewName it's in pageTrackingDic
  if (viewName in pageTrackingDic) {
    segmentPage(pageTrackingDic[viewName]);
  }
};

const segmentTrackCallsSMSRule = function(ruleName) {
  segmentTrack(EVENT_SETUP_CALLS_SMS, { rule_name: ruleName });
};

const segmentTrackLocationRule = function(ruleName) {
  segmentTrack(EVENT_SETUP_LOCATION_RULE, { rule_name: ruleName });
};

const segmentTrackPanicButtonRule = function(ruleName) {
  segmentTrack(EVENT_SETUP_PANIC_BUTTON, { rule_name: ruleName });
};

const segmentLoad = safeFn(function() {
  if (QFP.QInit.Dashboard.Segment.Enabled) {
    // Snippet
    var analytics = (window.analytics = window.analytics || []);
    if (!analytics.initialize)
      if (analytics.invoked)
        window.console && console.error && console.error('Segment snippet included twice.');
      else {
        analytics.invoked = !0;
        analytics.methods = [
          'trackSubmit',
          'trackClick',
          'trackLink',
          'trackForm',
          'pageview',
          'identify',
          'reset',
          'group',
          'track',
          'ready',
          'alias',
          'debug',
          'page',
          'once',
          'off',
          'on',
        ];
        analytics.factory = function(t) {
          return function() {
            var e = Array.prototype.slice.call(arguments);
            e.unshift(t);
            analytics.push(e);
            return analytics;
          };
        };
        for (var t = 0; t < analytics.methods.length; t++) {
          var e = analytics.methods[t];
          analytics[e] = analytics.factory(e);
        }
        analytics.load = function(t, e) {
          var n = document.createElement('script');
          n.type = 'text/javascript';
          n.async = !0;
          n.src = 'https://cdn.segment.com/analytics.js/v1/' + t + '/analytics.min.js';
          var a = document.getElementsByTagName('script')[0];
          a.parentNode.insertBefore(n, a);
          analytics._loadOptions = e;
        };
        analytics.SNIPPET_VERSION = '4.1.0';
      }

    let apiKey = QFP.QInit.Dashboard.Segment.Key;
    let uid = QFP.Run.ViewData.UID;
    if (apiKey != 'undefined' && apiKey !== null) {
      // Load snippet
      analytics.load(apiKey);
      // Identify after load if user is not identified yet
      let isIdentified = Cookies.get('segment-is-identified') == 'true';
      if (!isIdentified && uid != null && uid != '') {
        analytics.identify(uid, null, null, function() {
          Cookies.set('segment-is-identified', 'true', { domain: '.' + window.location.host });
          segmentTrack(EVENT_OPEN_FP);
          checkPageTracking(QFP.Run.ViewName);
        });
      } else {
        checkPageTracking(QFP.Run.ViewName);
      }
    }
  }
});

const segmentTrackSocialMonitoring = function(ruleName) {
  segmentTrack(EVENT_SETUP_RULE_SOCIAL, { rule_name: ruleName });
};

var segmentTrackVideoSetupRules = function(ruleName, platform) {
  segmentTrack(EVENT_VIDEO_SETUP_RULES, { rule_name: ruleName, video_platform: platform });
};

var segmentTrackClickedTimelineCard = function(type, subtype) {
  segmentTrack(EVENT_CLICKED_TIMELINE_CARD, { type: getSegmentEventType(type, subtype) });
};
var segmentTrackVideoSetupBlock = function(action, platform, url, title, category) {
  segmentTrack(EVENT_VIDEO_SETUP_BLOCK_VIDEO, {
    url: url,
    title: title,
    category: category,
    status: action,
    video_platform: platform,
  });
};

var segmentTrackOptInParWeb = function() {
  segmentTrack(EVENT_OPT_IN_PAR_WEB);
};

/**
 * Attach SegmentIO initialization on document ready
 */
$(document).ready(segmentLoad);
