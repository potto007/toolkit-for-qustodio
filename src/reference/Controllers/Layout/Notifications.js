///////////////////////////////////////////////////////////////////////////////
//  File:	Notifications.js
//  Project:	Qustodio Family Portal
//  Company:    Evolium
//  Author:     Francesco Carrella (francesco.carrella@evolium.com)
//  Created:    2011-05-14
///////////////////////////////////////////////////////////////////////////////

QFP.Controllers.Layout.Notifications = (function() {
  var settings = {
    requestsUrl: '/client-requests/notifications',
  };

  var default_notifications_config = {
    id: false,
    type: 'info',
    hideable: true,
    autoHide: 6000,
    autoRemove: false,
    showDelay: false,
  };

  var default_popup_config = {
    id: false,
    iframe: true,
    autoRemove: true,
    width: 640,
    height: 360,
    initialWidth: 10,
    initialHeight: 10,
    oversizeWidth: 10,
    oversizeHeight: 30,
    scrolling: false,
    onOpen: function() {
      $body.css('overflow', 'hidden');
    },
    onCleanup: function() {
      $body.css('overflow', 'auto');
    },
  };

  var notifications_bar;

  var flyovers_config = {
    'premium-trial': { width: 750, height: 450 },
    'premium-generic': { width: 744, height: 452 },
    'free-upgrade': { width: 744, height: 452 },
    'call-sms-flyover': { width: 744, height: 452 },
    'premium-welcome': { width: 910, height: 580 },
    'new-free-conversion-flyover-b': { width: 750, height: 450 },
  };

  var renewal_flyover_variant;

  function init() {
    notifications_bar = $('#notifications_bar');

    renewal_flyover_variant = QFP.Run.ViewData.RenewalFlyoverVariant;
  }

  function showTopBanner(template) {
    switch (template) {
      case 'downtime':
        var variables = {
          VersionNumber: QFP.Run.ViewData.VersionNumber,
        };
        var config = { banner_text: QFP.lng('_strDowntimeTopBanner', variables) };
        $('body').prepend(QFP.Utilities.Templates.render(template, config));
        break;
      case 'intro_pb_cs':
        var variables = {
          '{{user_id}}': QFP.Run.ViewData.UserId == undefined ? ' ' : QFP.Run.ViewData.UserId,
          '{{public_web}}': QFP.Run.ViewData.PublicWeb,
        };
        var config = { banner_text: QFP.lng('_strIntro2features', variables) };
        $('body').prepend(QFP.Utilities.Templates.render(template, config));
        break;

      case 'top_banner':
        var variables = {
          '{{link}}': 'javascript://',
        };
        var config = {
          banner_text: QFP.lng('_strTopBanner', variables),
          VersionNumber: QFP.Run.ViewData.VersionNumber,
        };
        $('body').prepend(QFP.Utilities.Templates.render(template, config));
        break;

      case 'new_family_portal': {
        const isOnboardingPageVisible = window.location.hash;
        if (!isOnboardingPageVisible) {
          var config = {
            banner_text: QFP.lng('_strNewFamilyPortalBannerText'),
            link_text: QFP.lng('_strNewFamilyPortalLinkText'),
            VersionNumber: QFP.Run.ViewData.VersionNumber,
            handleClick: function() {
              return function(selector) {
                segmentTrackOptInParWeb();

                $('.' + selector).addClass(selector + '--loading');

                $.ajax({
                  url: '/login/auto-login-url-par-web',
                  type: 'GET',
                  success: function(data) {
                    window.location.replace(data.autoLoginUrl);
                    $('.' + selector).removeClass(selector + '--loading');
                  },
                });
              };
            },
          };

          $('body').prepend(QFP.Utilities.Templates.render(template, config));
        }
        break;
      }

      case 'bts_2016_topbar01':
      case 'bts_2016_topbar02':
      case 'bts_2016_topbar03retrial':
      case 'bts_2016_topbar03Premium':
      case 'bts_2016_topbar04':
        var banner_version = template.replace('bts_2016_topbar', '');
        var banner_text, banner_link;

        switch (banner_version) {
          case '01':
            banner_text = [
              '_strBTS16_BackSchool',
              '_strBTS16_HelpYourKids',
              '_strBTS16_AdjustTheir',
            ];
            banner_link = '/user-rules/web/days/7';
            break;
          case '02':
            banner_text = ['_strBTS16_BackSchool', '_strBTS16_MakeSure', '_strBTS16_ProtectNew'];
            banner_link = '/account-setup/add-device/';
            break;
          case '03retrial':
            banner_text = ['_strBTS16_BTSGift', '_strBTS16_GotFreeAccess', '_strBTS16_TryNow'];
            banner_link = '/bts2016';
            break;
          case '03Premium':
            banner_text = ['_strBTS16_QustodioBTS', '_strBTS16_TuneUp', '_strBTS16_SeeHow'];
            banner_link = '/bts2016';
            break;
          case '04':
            banner_text = ['_strBTS16_QustodioBTSSale', '_strBTS16_Get35Off', '_strBTS16_BuyNow'];
            banner_link = QFP.QInit.Marketing.PublicSite.premium_plans_link;
            break;
          default:
            break;
        }

        console.log(QFP.QInit.Marketing.PublicSite.premium_plans_link);

        var config = {
          banner_title: QFP.lng(banner_text[0]),
          banner_text: QFP.lng(banner_text[1]),
          banner_link_text: QFP.lng(banner_text[2]),
          banner_link: banner_link,
          VersionNumber: QFP.Run.ViewData.VersionNumber,
          public_web: QFP.Run.ViewData.PublicWeb,
          track_label: $('body').attr('e_label'),
          banner_version: banner_version,
        };

        template = 'bts_2016_topbar'; // We override it to use a common one
        $('body').prepend(QFP.Utilities.Templates.render(template, config));
        break;

      case 'blackfriday_2016_topbar':
        var config = {
          banner_text: QFP.lng('_strBF2015TopBannerText'),
          VersionNumber: QFP.Run.ViewData.VersionNumber,
          public_web: QFP.Run.ViewData.PublicWeb,
          track_label: $('body').attr('e_label'),
        };
        $('body').prepend(QFP.Utilities.Templates.render(template, config));
        break;

      case 'upsell_topbar':
        var device_limit = QFP.Run.ViewData.License.max_devices,
          profile_count = QFP.Run.ViewData.NumProfiles,
          device_count = QFP.Run.ViewData.NumDevices,
          banner_text;

        if (QFP.Run.ViewData.License.type != 'LICENSE_PREMIUM') {
          break;
        }

        if (profile_count >= device_limit || device_count >= device_limit) {
          banner_text = QFP.lng('_strUpsellBannerTextLimit', {
            '{{name}}': QFP.Run.ViewData.AccountName,
          });
        } else if (profile_count === device_limit - 1 || device_count === device_limit - 1) {
          banner_text = QFP.lng('_strUpsellBannerTextAlmost', {
            '{{name}}': QFP.Run.ViewData.AccountName,
          });
        } else {
          break;
        }

        var config = {
          banner_text: banner_text,
          banner_link_text: QFP.lng('_strUpsellBannerLinkText'),
          banner_link:
            QFP.QInit.Marketing.PublicSite.upsell_landing + '?uid=' + QFP.Run.ViewData.UID,
          VersionNumber: QFP.Run.ViewData.VersionNumber,
          public_web: QFP.Run.ViewData.PublicWeb,
          track_label: $('body').attr('e_label'),
        };
        $('body').prepend(QFP.Utilities.Templates.render(template, config));
        break;

      case 'logbook_topbar':
        var profile_id = QFP.Run.ViewData.UserId,
          profile_name = QFP.Run.ViewData.profileName,
          profile_has_logbook = QFP.Run.ViewData.profileHasLogbook;

        if (profile_id == undefined || profile_name == undefined || !profile_has_logbook) {
          break;
        }

        var config = {
          banner_text: QFP.lng('_strLogbookTopbar', { '{{profile_name}}': profile_name }),
          banner_link: '/user-activity/logbook/user/' + profile_id,
          VersionNumber: QFP.Run.ViewData.VersionNumber,
          public_web: QFP.Run.ViewData.PublicWeb,
          track_label: $('body').attr('e_label'),
        };
        $('body').prepend(QFP.Utilities.Templates.render(template, config));
        break;

      case 'bts_2017_topbar01':
      case 'bts_2017_topbar02':
      case 'bts_2017_topbar03':
      case 'bts_2017_topbar04':
      case 'bts_2017_topbar05':
      case 'bts_2017_topbar06':
        var banner_version = template.replace('bts_2017_topbar', '');

        var banners = {
          '01': {
            text: QFP.lng('_strBTS2017Topbar01'),
            link: '/user-rules/web/days/7',
          },
          '02': {
            text: QFP.lng('_strBTS2017Topbar02'),
            link: '/bts2017',
          },
          '03': {
            text: QFP.lng('_strBTS2017Topbar03'),
            link: '/account-setup/add-device/',
          },
          '04': {
            text: QFP.lng('_strBTS2017Topbar04'),
            link: '/bts2017',
          },
          '05': {
            text: QFP.lng('_strBTS2017Topbar05'),
            link: '',
          },
          '06': {
            text: QFP.lng('_strBTS2017Topbar06', {
              '{{days}}': QFP.Run.ViewData.License.days_to_expire,
            }),
            link: '',
          },
        };

        var config = {
          banner_version: banner_version,
          banner_text: banners[banner_version]['text'],
          banner_link: banners[banner_version]['link'],
          VersionNumber: QFP.Run.ViewData.VersionNumber,
          public_web: QFP.Run.ViewData.PublicWeb,
          track_category: 'bts2017-fp-bar-' + banner_version,
          track_label: $('body').attr('e_label'),
        };

        template = 'bts_2017_topbar'; // We override it to use a common one
        $('body').prepend(QFP.Utilities.Templates.render(template, config));
        break;

      case 'christmas_2016_topbar01': // Teaser FREE
      case 'christmas_2016_topbar02': // Teaser Premium
      case 'christmas_2016_topbar03': // Retrial
      case 'christmas_2016_topbar04': // App Retrial
      case 'christmas_2016_topbar05': // App Premium
      case 'christmas_2016_topbar06': // Retrial reminder
        var banner_version = template.replace('christmas_2016_topbar', '');

        var banners = {
          '01': {
            text: QFP.lng('_strChr16SomethingBig'),
            link: false,
          },
          '02': {
            text: QFP.lng('_strChr16SomethingBig2'),
            link: false,
          },
          '03': {
            text: QFP.lng('_strChr16HappyHolidays'),
            link: '/christmas-2016/re/',
          },
          '04': {
            text: QFP.lng('_strChr16HereItIs'),
            link: '/christmas-2016/pa/',
          },
          '05': {
            text: QFP.lng('_strChr16HereItIs'),
            link: '/christmas-2016/pa/',
          },
          '06': {
            text: QFP.lng('_strChr16HeyName', {
              '{{account_name}}': QFP.Run.ViewData.AccountName,
              '{{link1}}': '/account-setup/add-device/',
              '{{link2}}': '/christmas-2016/pa/',
              '{{num_days}}': QFP.Run.ViewData.License.days_to_expire,
            }),
            link: false,
          },
        };

        var config = {
          banner_text: banners[banner_version]['text'],
          banner_link: banners[banner_version]['link'],
          VersionNumber: QFP.Run.ViewData.VersionNumber,
          public_web: QFP.Run.ViewData.PublicWeb,
          track_category: 'christmas2016-fp-bar-' + banner_version,
          track_label: $('body').attr('e_label'),
        };

        template = 'christmas_2016_topbar'; // We override it to use a common one
        $('body').prepend(QFP.Utilities.Templates.render(template, config));
        break;

      case 'ios_mdm_topbar':
        var config = {
          banner_text: QFP.lng('_strIOSMDMTopBannerText'),
          VersionNumber: QFP.Run.ViewData.VersionNumber,
          public_web: QFP.Run.ViewData.PublicWeb,
          track_label: $('body').attr('e_label'),
        };
        $('body').prepend(QFP.Utilities.Templates.render(template, config));
        break;

      case 'halloween_topbar':
        var config = {
          banner_strong: QFP.lng('_strHalloween2015TopBannerStrong'),
          banner_text: QFP.lng('_strHalloween2015TopBannerText'),
          banner_link: QFP.lng('_strHalloween2015TopBannerLink'),
          VersionNumber: QFP.Run.ViewData.VersionNumber,
          track_label: $('body').attr('e_label'),
        };
        $('body').prepend(QFP.Utilities.Templates.render(template, config));
        break;

      case 'halloween_2017_topbar':
        var config = {
          banner_strong: QFP.lng('_strHalloween2017TopbarScaryHalloweenSale'),
          banner_text: QFP.lng('_strHalloween2017TopbarGetQustodioPremium'),
          banner_link: QFP.lng('_strHalloween2017TopbarBuyNow'),
          VersionNumber: QFP.Run.ViewData.VersionNumber,
          track_label: $('body').attr('e_label'),
        };
        $('body').prepend(QFP.Utilities.Templates.render(template, config));
        break;

      case 'blackfriday_2017_topbar':
        var config = {
          banner_text: QFP.lng('_strBlackFriday2017Topbar'),
          VersionNumber: QFP.Run.ViewData.VersionNumber,
          track_label: $('body').attr('e_label'),
        };
        $('body').prepend(QFP.Utilities.Templates.render(template, config));
        break;

      case 'bts2015':
        var variables = { '{{link}}': 'javascript://' };
        var config = {};
        var context = 'show_topbar';
        $e_label = $('body').attr('e_label');

        var routes = QFP.Utilities.Routing.Server.get();
        if (routes['controller'] === 'bts2015') {
          break;
        }

        if ('account-setup' === routes['controller'] && 'premium-offer' === routes['view']) {
          break;
        }

        if (
          jQuery.inArray(QFP.Run.ViewData.License.campaign.code, [
            'lacaixa_trial3only',
            'uie_pr',
            'uie_pr_de',
            'uie_target_premium_3',
            'uie_target_premium_3_de',
            'premium-only-iusacell',
          ]) > -1
        ) {
          break;
        }

        if (
          jQuery.inArray(QFP.Run.ViewData.License.campaign.code, [
            'backtoschool_2015_free1',
            'backtoschool_2015_free2',
            'backtoschool_2015_free5',
            'backtoschool_2015_free10',
          ]) > -1
        ) {
          _gaq.push([
            '_trackEvent',
            'bts-retrial-topbar',
            'load-bar',
            $e_label + '-context-' + context,
          ]);
          config = {
            banner_text: QFP.lng('_strTopBannerTitlePremiumBTS2015', variables),
            banner_description: QFP.lng('_strTopBannerDescriptionPremiumBTS2015', variables),
            banner_link: QFP.lng('_strTopBannerLinkPremiumBTS2015', variables),
            VersionNumber: QFP.Run.ViewData.VersionNumber,
            track_category: 'bts-retrial-topbar',
            track_action: 'click-bar',
            track_label: $e_label,
          };
        } else {
          _gaq.push([
            '_trackEvent',
            'bts-premium-and-fresh-topbar',
            'load-bar',
            $e_label + '-context-' + context,
          ]);
          config = {
            banner_text: QFP.lng('_strTopBannerTitleBTS2015', variables),
            banner_description: QFP.lng('_strTopBannerDescriptionBTS2015', variables),
            banner_link: QFP.lng('_strTopBannerLinkBTS2015', variables),
            VersionNumber: QFP.Run.ViewData.VersionNumber,
            track_category: 'bts-premium-and-fresh-topbar',
            track_action: 'click-bar',
            track_label: $e_label,
          };
        }

        $('body').prepend(QFP.Utilities.Templates.render(template, config));
        break;

      case 'summer_2016_topbar':
        var e_category = 'summer2016-fp-bar';
        if (QFP.Run.ViewData.campaignEnabled) {
          var variables = {
            '{{link}}': QFP.QInit.Marketing.PublicSite.premium_plans_link,
            '{{e_category}}': e_category,
            '{{e_label}}': $('body').attr('e_label'),
          };
          var config = {
            banner_text: QFP.lng('_strSummer16TopBanner', variables),
            VersionNumber: QFP.Run.ViewData.VersionNumber,
            track_label: $('body').attr('e_label'),
            track_category: e_category,
          };
          $('body').prepend(QFP.Utilities.Templates.render(template, config));
        }
        break;

      case 'summer_2017_topbar':
        var e_category = 'summer17-fp-bar';
        if (QFP.Run.ViewData.campaignEnabled) {
          var config = {
            banner_text: QFP.lng('_strSummer17TopBanner', variables),
            banner_link: QFP.QInit.Marketing.PublicSite.premium_plans_link,
            VersionNumber: QFP.Run.ViewData.VersionNumber,
            track_label: $('body').attr('e_label'),
            track_category: e_category,
          };
          $('body').prepend(QFP.Utilities.Templates.render(template, config));
        }
        break;

      case 'onboarding':
        var textNotification = QFP.lng('_strAdvertiseParentsApp', {
          '{{link}}': QFP.QInit.Marketing.PublicSite.help_mdm + '/#parents_app',
        });
        var topBarNotification = new TopBarNotification({
          iconClass: 'icon-',
          iconRef: '&#xf10b;',
          text: textNotification,
        });
        topBarNotification.show();
        Cookies.remove('onboarding');
        break;

      case 'christmas_2017_topbar01':
      case 'christmas_2017_topbar02':
      case 'christmas_2017_topbar03':
      case 'christmas_2017_topbar04':
      case 'christmas_2017_topbar05':
        var bannerVersion = template.replace('christmas_2017_topbar', '');

        var linkLanding = '/christmas2017-retrial';
        var linkFlyOver04 = '/popup/christmas-2017-flyover-04';
        var linkFlyOver05 = '/popup/christmas-2017-flyover-05';

        var currentDate = new Date();
        var endTrialDate = new Date(QFP.Run.ViewData.License.end_date);

        var days = QFP.Utilities.DateTime.diffDays(currentDate, endTrialDate);

        var banners = {
          '01': {
            text: QFP.lng('_strChristmas2017TopBar01', { '{{link}}': linkLanding }),
            link: linkLanding,
            popup: false,
          },
          '02': {
            text: QFP.lng('_strChristmas2017TopBar02', {
              '{{link}}': linkLanding,
              '{{name}}': QFP.Run.ViewData.AccountName,
              '{{days}}': days,
            }),
            link: linkLanding,
            popup: false,
          },
          '03': {
            text: QFP.lng('_strChristmas2017TopBar03', {
              '{{link}}': linkLanding,
              '{{name}}': QFP.Run.ViewData.AccountName,
              '{{days}}': days,
            }),
            link: linkLanding,
            popup: false,
          },
          '04': {
            text: QFP.lng('_strChristmas2017TopBar04'),
            link: linkFlyOver04,
            popup: true,
          },
          '05': {
            text: QFP.lng('_strChristmas2017TopBar05'),
            link: linkFlyOver05,
            popup: true,
          },
        };

        if (days == 0) {
          banners['03']['text'] = QFP.lng('_strChristmas2017TopBar03LastDay', {
            '{{link}}': linkLanding,
            '{{name}}': QFP.Run.ViewData.AccountName,
          });
        }

        var config = {
          banner_text: banners[bannerVersion]['text'],
          banner_link: banners[bannerVersion]['link'],
          open_popup: banners[bannerVersion]['popup'],
          VersionNumber: QFP.Run.ViewData.VersionNumber,
          public_web: QFP.Run.ViewData.PublicWeb,
          track_category: 'christmas2017-fp-bar-' + bannerVersion,
          track_label: $('body').attr('e_label'),
        };

        template = 'christmas_2017_topbar'; // We override it to use a common one
        $('body').prepend(QFP.Utilities.Templates.render(template, config));
        break;
      case 'stpatricks_2018_topbar':
        var e_category = 'stpatricks2018-fp-bar';
        if (QFP.Run.ViewData.campaignEnabled) {
          var config = {
            banner_text: QFP.lng('_strStPatricks2018TopBar'),
            VersionNumber: QFP.Run.ViewData.VersionNumber,
            track_label: $('body').attr('e_label'),
            track_category: e_category,
          };
          template = 'stpatricks_2018_topbar';
          $('body').prepend(QFP.Utilities.Templates.render(template, config));
        }
        break;
      case 'summer_2018_topbar':
        var e_category = 'summer18-fp-bar';
        if (QFP.Run.ViewData.campaignEnabled) {
          var config = {
            banner_text: QFP.lng('_strSummer2018TopBanner', variables),
            VersionNumber: QFP.Run.ViewData.VersionNumber,
            track_label: $('body').attr('e_label'),
            track_category: e_category,
          };
          $('body').prepend(QFP.Utilities.Templates.render(template, config));
        }
        break;
      case 'bts_2018_topbar_01':
      case 'bts_2018_topbar_02':
      case 'bts_2018_topbar_03':
      case 'bts_2018_topbar_04':
      case 'bts_2018_topbar_05':
      case 'bts_2018_topbar_06':
        var bannerVersion = template.replace('bts_2018_topbar_', '');

        var linkLanding = '/bts2018';
        var linkFlyover = '/popup/bts-2018-flyover-02';

        var currentDate = new Date();
        var endTrialDate = new Date(QFP.Run.ViewData.License.end_date);

        var days = QFP.Utilities.DateTime.diffDays(currentDate, endTrialDate);

        var banners = {
          '01': {
            text: QFP.lng('_strBTS2018TopBar01', { '{{link}}': linkLanding }),
            link: linkLanding,
            popup: false,
          },
          '02': {
            text: QFP.lng('_strBTS2018TopBar02', { '{{link}}': linkLanding, '{{days}}': days }),
            link: linkLanding,
            popup: false,
          },
          '03': {
            text: QFP.lng('_strBTS2018TopBar03', {
              '{{link}}': '/account-setup/premium-offer-two/',
              '{{name}}': QFP.Run.ViewData.AccountName,
              '{{days}}': days,
            }),
            link: '/account-setup/premium-offer-two/',
            popup: false,
          },
          '04': {
            text: QFP.lng('_strBTS2018TopBar04'),
            link: linkFlyover,
            popup: true,
          },
          '05': {
            text: QFP.lng('_strBTS2018TopBar05'),
            link: linkFlyover,
            popup: true,
          },
          '06': {
            text: QFP.lng('_strBTS2018TopBar06', {
              '{{link}}': linkLanding,
              '{{name}}': QFP.Run.ViewData.AccountName,
              '{{days}}': days,
            }),
            link: linkLanding,
            popup: false,
          },
        };

        var config = {
          banner_text: banners[bannerVersion]['text'],
          banner_link: banners[bannerVersion]['link'],
          open_popup: banners[bannerVersion]['popup'],
          VersionNumber: QFP.Run.ViewData.VersionNumber,
          public_web: QFP.Run.ViewData.PublicWeb,
          track_category: 'bts2018-fp-bar-' + bannerVersion,
          track_label: $('body').attr('e_label'),
        };

        template = 'bts_2018_topbar';
        $('body').prepend(QFP.Utilities.Templates.render(template, config));
        break;
      case 'halloween_2018_topbar':
        var e_category = 'halloween18-fp-bar';
        if (QFP.Run.ViewData.campaignEnabled) {
          var config = {
            banner_text: QFP.lng('_strHalloween2018TopBanner'),
            VersionNumber: QFP.Run.ViewData.VersionNumber,
            track_label: $('body').attr('e_label'),
            track_category: e_category,
          };
          $('body').prepend(QFP.Utilities.Templates.render(template, config));
        }
        break;
      case 'blackfriday_2018_topbar':
        var config = {
          banner_text: QFP.lng('_strBlackFriday2018Topbar'),
          VersionNumber: QFP.Run.ViewData.VersionNumber,
          track_label: $('body').attr('e_label'),
        };
        $('body').prepend(QFP.Utilities.Templates.render(template, config));
        break;
      case 'xmas_2018_topbar_01':
      case 'xmas_2018_topbar_02':
      case 'xmas_2018_topbar_03':
      case 'xmas_2018_topbar_04':
      case 'xmas_2018_topbar_05':
        var bannerVersion = template.replace('xmas_2018_topbar_', '');

        var linkLanding = '/christmas2018';
        var linkFlyover = '/popup/xmas-2018-flyover-03';

        var banners = {
          '01': {
            text: QFP.lng('_strXmas2018FreeAccessToPremium'),
            link: linkLanding,
            popup: false,
          },
          '02': {
            text: QFP.lng('_strXmas2018WevePreparedAFree'),
            link: linkLanding,
            popup: false,
          },
          '03': {
            text: QFP.lng('_strXmas2018YourPremiumTrialExpires'),
            link: linkLanding,
            popup: false,
          },
          '04': {
            text: QFP.lng('_strXmas2018HolidaySaleYourTrial'),
            link: linkFlyover,
            popup: true,
          },
          '05': {
            text: QFP.lng('_strXmas2018LastChanceHurryUpgrade'),
            link: linkFlyover,
            popup: true,
          },
        };

        var config = {
          banner_text: banners[bannerVersion]['text'],
          banner_link: banners[bannerVersion]['link'],
          banner_version: bannerVersion,
          open_popup: banners[bannerVersion]['popup'],
          VersionNumber: QFP.Run.ViewData.VersionNumber,
          public_web: QFP.Run.ViewData.PublicWeb,
          track_category: 'xmas2018-fp-bar-' + bannerVersion,
          track_label: $('body').attr('e_label'),
        };

        template = 'xmas_2018_topbar';
        $('body').prepend(QFP.Utilities.Templates.render(template, config));
        break;

      case 'stpatricks_2019_topbar':
        var e_category = 'stpatricks2019-fp-bar';
        if (QFP.Run.ViewData.campaignEnabled) {
          var config = {
            banner_text: QFP.lng('_strStPatricks2018TopBar'),
            VersionNumber: QFP.Run.ViewData.VersionNumber,
            track_label: $('body').attr('e_label'),
            track_category: e_category,
          };
          template = 'stpatricks_2019_topbar';
          $('body').prepend(QFP.Utilities.Templates.render(template, config));
        }
        break;

      case 'summer_2019_topbar_01':
      case 'summer_2019_topbar_02':
        var bannerVersion = template.replace('summer_2019_topbar_', '');

        if (QFP.Run.ViewData.campaignEnabled) {
          var config = {
            banner_text: QFP.lng('_strSummer2019TopBar' + bannerVersion),
            bannerVersion: bannerVersion,
            VersionNumber: QFP.Run.ViewData.VersionNumber,
            track_label: $('body').attr('e_label'),
            target: '/popup/summer-2019-flyover-' + bannerVersion,
            track_category: '2019-summer-fp-bar-' + bannerVersion,
          };
          template = 'summer_2019_topbar';
          $('body').prepend(QFP.Utilities.Templates.render(template, config));
        }
        break;

      case 'bts_2019_topbar_01':
      case 'bts_2019_topbar_02':
      case 'bts_2019_topbar_03':
      case 'bts_2019_topbar_04':
      case 'bts_2019_topbar_05':
      case 'bts_2019_topbar_06':
      case 'bts_2019_topbar_07':
        var bannerVersion = template.replace('bts_2019_topbar_', '');

        var linkLanding = '/account-setup/premium-offer-two/';

        var currentDate = new Date();
        var endTrialDate = new Date(QFP.Run.ViewData.License.end_date);

        var days = QFP.Utilities.DateTime.diffDays(currentDate, endTrialDate);

        var banners = {
          '01': {
            text: QFP.lng('_strBts2019TopBar01', { '{{days}}': days }),
            link: '/popup/bts-2019-flyover-01',
            popup: true,
          },
          '02': {
            text: QFP.lng('_strBts2019TopBar02', { '{{days}}': days }),
            link: '/popup/bts-2019-flyover-02',
            popup: true,
          },
          '03': {
            text: QFP.lng('_strBts2019TopBar03', { '{{days}}': days }),
            link: '/popup/bts-2019-flyover-03',
            popup: true,
          },
          '04': {
            text: QFP.lng('_strBts2019TopBar04', { '{{days}}': days }),
            link: linkLanding,
            popup: false,
          },
          '05': {
            text: QFP.lng('_strBts2019TopBar05'),
            link: linkLanding,
            popup: false,
          },
          '06': {
            text: QFP.lng('_strBts2019TopBar06'),
            link: '/popup/bts-2019-flyover-04',
            popup: true,
          },
          '07': {
            text: QFP.lng('_strBts2019TopBar07'),
            link: '/popup/bts-2019-flyover-05',
            popup: true,
          },
        };

        var config = {
          banner_text: banners[bannerVersion]['text'],
          banner_link: banners[bannerVersion]['link'],
          banner_version: bannerVersion,
          open_popup: banners[bannerVersion]['popup'],
          VersionNumber: QFP.Run.ViewData.VersionNumber,
          public_web: QFP.Run.ViewData.PublicWeb,
          track_category: '2019-bts-fp-bar-' + bannerVersion,
          track_label: $('body').attr('e_label'),
        };

        template = 'bts_2019_topbar';
        $('body').prepend(QFP.Utilities.Templates.render(template, config));
        break;

      default:
        break;
    }
  }

  /* Bottom Bar Notifications */

  function showError(notification) {
    // if passed obj is a string, create a config object and put the passed param as language tag
    if (typeof notification == 'string') {
      notification = {
        textTag: notification,
      };
    }
    notification.type = 'error';
    return add(notification);
  }

  function showSuccess(notification) {
    // if passed obj is a string, create a config object and put the passed param as language tag
    if (typeof notification == 'string') {
      notification = {
        textTag: notification,
      };
    }
    notification.type = 'success';
    return add(notification);
  }

  function showAlert(notification) {
    // if passed obj is a string, create a config object and put the passed param as language tag
    if (typeof notification == 'string') {
      notification = {
        textTag: notification,
      };
    }
    notification.type = 'alert';
    return add(notification);
  }

  function add(notification) {
    if ($.isArray(notification)) {
      $.each(notification, function(index, value) {
        add(value);
      });
    }
    if (
      $.isPlainObject(notification) &&
      !(notification.id || notification.textTag || notification.text)
    ) {
      $.each(notification, function(key, value) {
        value.id = key;
        add(value);
      });
    } else {
      if (typeof notification == 'string') {
        notification = {
          textTag: notification,
        };
      }

      // merge defalt config with passed config
      var config = $.extend({}, default_notifications_config, notification);

      config.textHtml = QFP.lng(notification.textTag, notification.languageParams);
      if (typeof config.templateData == 'object') {
        config.textHtml = Mustache.render(config.textHtml, config.templateData);
      }

      var new_notification = $(QFP.Utilities.Templates.render('notifications_bar_li', config));
      new_notification.data('config', config).appendTo($('ul', notifications_bar));

      if (config.hideable) {
        addCloseButton(new_notification);
      }

      if (QFP.Controllers.Layout.Notifications.Controllers[config.id]) {
        QFP.Controllers.Layout.Notifications.Controllers[config.id].init();
      }

      new_notification.data('config', config);

      setBindings(new_notification);
      show(new_notification, config.showDelay);

      pending_notifications = {};

      return new_notification;
    }
  }

  function getAll() {
    $.ajax({
      url: settings.requestsUrl,
      type: 'POST',
      data: {
        optionName: 'get_all',
      },
      success: showMixed,
    });
  }

  function remove(id) {
    $.ajax({
      url: settings.requestsUrl,
      async: false,
      type: 'POST',
      data: {
        optionName: 'remove',
        id: id,
      },
    });
  }

  function addCloseButton(notification) {
    var close_button = $('<a class="close_button"></a>');
    close_button.prependTo($('.content', notification)).click(function() {
      hide(notification, true);
    });
  }

  function setBindings(notification) {
    notification.bind({
      mouseenter: function() {
        var autoHideTimeout = notification.data('autoHideTimeout');
        clearTimeout(autoHideTimeout);
      },
      mouseleave: function() {
        setAutoHide(notification);
      },
    });
  }

  function setAutoHide(notification) {
    var config = notification.data('config');
    if (config.autoHide) {
      var autoHideTimeout = setTimeout(function() {
        hide(notification, config.autoRemove);
      }, config.autoHide);
      notification.data('autoHideTimeout', autoHideTimeout);
    }
  }

  function show(notification, showDelay) {
    notification
      .stop()
      .delay(showDelay || 0)
      .slideDown();

    setAutoHide(notification);
  }

  function hide(notification, remove_on_hide) {
    notification.stop().slideUp('fast', function() {
      notification.hide();
      notification.remove();
    });

    if (remove_on_hide) {
      remove(notification.attr('id'));
    }
  }

  /* POPUP NOTIFICATIONS */
  function showPopup(notification, options) {
    try {
      if ($.isArray(notification)) {
        console.error('showPopup() do not work with array objects!');
      } else {
        notification = $.extend({}, default_popup_config, notification);

        var aux = notification.href;
        aux = aux.split('?');
        aux = aux[0].split('/');
        if (aux[2] == 'parents-app-flyover') {
          var is_mobile = false;
          if (
            window.screen.width <= 420 &&
            (navigator.userAgent.match(/Android/i) ||
              navigator.userAgent.match(/iPhone/i) ||
              navigator.userAgent.match(/iPod/i))
          ) {
            var os = navigator.userAgent.match(/Android/i) ? 'android' : 'ios';
            // Mobile version has to overtake the whole screen
            notification.width = '100%';
            notification.height = '100%';
            notification.href = notification.href + '/version/mobile/os/' + os;
            notification.opacity = 1;
            is_mobile = true;
          } else {
            // Desktop version
            notification.width = 964;
            notification.height = 582;
            notification.initialWidth = 964;
            notification.initialHeight = 582;
            notification.href = notification.href + '/version/desktop';
          }

          // OH MY, WHY, THEY MADE ME DO IT
          notification.onOpen = function() {
            $('#colorbox').addClass('colorbox--no-frame');
            if (is_mobile) {
              $('#colorbox').addClass('colorbox--mobile');
              $('#cboxOverlay').addClass('colorbox--mobile');
            }
          };

          notification.onClosed = function() {
            var category = is_mobile ? 'par-mobile-flyover' : 'par-desktop-flyover';
            _gaq.push(['_trackEvent', category, 'click', 'close-button']);
          };
        }
        if (aux[2] == 'new-free-conversion-flyover') {
          var flyover_to_show = notification.flyover_to_show;

          if (typeof options !== 'undefined' && options.flyover) {
            flyover_to_show = options.flyover;
          }

          if (flyover_to_show == false) {
            return false;
          }
          // Fix for the Expired Flyover Mayhem
          if (flyover_to_show == 'expired') {
            notification.href =
              '/popup/premium-trial/t/expired/view/user-activity-summary/context/login';
          } else {
            notification.href += '/flyover/' + flyover_to_show;
          }
        }
        if (aux[2] == 'upsell-flyover') {
          var profile_limit = QFP.Run.ViewData.License.max_profiles,
            device_limit = QFP.Run.ViewData.License.max_devices,
            profile_count = QFP.Run.ViewData.NumProfiles,
            device_count = QFP.Run.ViewData.NumDevices,
            total_items = profile_count + device_count;

          if (QFP.Run.ViewData.License.type != 'LICENSE_PREMIUM') {
            return false;
          }

          if (profile_count < profile_limit - 1 && device_count < device_limit - 1) {
            QFP.Utilities.Marketing.updateUpsellFlyoverRecord(total_items);
            return false;
          }

          var last_record = upsell_flyover_record;
          if (last_record !== false) {
            if (last_record == total_items) {
              return false;
            } else {
              QFP.Utilities.Marketing.updateUpsellFlyoverRecord(total_items);
            }
          } else {
            QFP.Utilities.Marketing.updateUpsellFlyoverRecord(total_items);
          }
          QFP.Controllers.Layout.TopBar.removeHide('upsell-topbar');
        }
        if (aux[2] == 'premium-welcome') {
          // OH MY, WHY, THEY MADE ME DO IT AGAIN
          notification.onOpen = function() {
            $('#colorbox').addClass('colorbox--no-frame colorbox--dark-close');
          };
        }
        if (
          (aux[2] == 'premium-ending' || aux[2] == 'premium-expired') &&
          renewal_flyover_variant == 'B'
        ) {
          notification.width = 770;
          notification.height = 490;
          notification.initialWidth = 770;
          notification.initialHeight = 490;

          // OH MY, WHY, THEY MADE ME DO IT
          notification.onOpen = function() {
            $('#colorbox').addClass('colorbox--no-frame');
          };
        }
        if (aux[2] == 'premium-trial' || aux[2] == 'new-free-conversion-flyover') {
          // OH MY, WHY, THEY MADE ME DO IT
          notification.onOpen = function() {
            $('#colorbox').addClass('colorbox--no-frame colorbox--dark-close');
          };
        }
        if (aux[2] == 'premium-expired-promo-flyover') {
          notification.href += '/view/' + QFP.Run.ViewName.replace('.', '-');
          notification.onOpen = function() {
            $('#colorbox').addClass('colorbox--no-frame colorbox--dark-close');
          };
        }

        if ((aux[2] == 'sc2016' && QFP.Run.ViewData.campaignEnabled) || aux[2] != 'sc2016') {
          if (flyovers_config[aux[2]] != undefined) {
            notification.width = flyovers_config[aux[2]].width;
            notification.height = flyovers_config[aux[2]].height;
          }

          notification = $.extend(notification, {
            width: notification.width + default_popup_config.oversizeWidth,
            height: notification.height + default_popup_config.oversizeHeight,
          });
          $.colorbox(notification);
        }
      }
    } catch (err) {}
  }

  /* MIXED NOTIFICATIONS */

  var pending_notifications = {},
    pending_popups = {},
    pending_top_banner = {};

  function showMixed(notifications) {
    if (notifications) {
      $.each(notifications, function(k, v) {
        if (v) {
          if (v.popup) {
            var flyover_to_show = true;
            var aux = v.href;
            aux = aux.split('/');
            if (aux[2] == 'new-free-conversion-flyover') {
              flyover_to_show = QFP.Utilities.Marketing.newFreeConversionFlyovers();
            }
            if (flyover_to_show) {
              v.flyover_to_show = flyover_to_show;
              pending_popups[k] = v;
            }
          } else if (v.top_banner && pending_top_banner.template == undefined) {
            pending_top_banner = v;
          } else if (v.top_banner == undefined) {
            pending_notifications[k] = v;
          }
        }
      });

      // setup colorbox
      try {
        var original_close_fn = $.fn.colorbox.close;
        if (pending_top_banner.template != undefined) {
          showTopBanner(pending_top_banner.template);
        }
        $.fn.colorbox.close = function() {
          var pending_popups_count = 0;
          for (var k in pending_popups) {
            if (pending_popups.hasOwnProperty(k)) {
              pending_popups_count++;
            }
          }

          if (pending_popups_count < 1) {
            add(pending_notifications);
            original_close_fn();
          } else {
            var next_popup_key;
            for (next_popup_key in pending_popups) break;
            showPopup(pending_popups[next_popup_key]);
            delete pending_popups[next_popup_key];
            remove(next_popup_key);
          }
        };
      } catch (err) {}

      var pending_popups_count = 0;
      for (var k in pending_popups) {
        if (pending_popups.hasOwnProperty(k)) {
          pending_popups_count++;
        }
      }

      // Remove AccountValidation notification if there is a ConfirmAccount popup; they are incompatibles;
      if (
        pending_popups.hasOwnProperty('ConfirmAccount') &&
        pending_notifications.hasOwnProperty('AccountValidation')
      ) {
        delete QFP.Controllers.Layout.Notifications.pendingNotifications.AccountValidation;
      }

      if (pending_popups_count > 0) {
        for (var next_popup_key in pending_popups) break;
        showPopup(pending_popups[next_popup_key]);
        delete pending_popups[next_popup_key];
        remove(next_popup_key);
      } else add(pending_notifications);
    }
  }

  function purchaseUpgrade() {
    $("a[provider='chargebee']")
      .on({
        click: function(e) {
          e.preventDefault();
          QFP.Controllers.Layout.Notifications.showPopup({
            href:
              '/account-setup/direct-purchase-upgrade/?cart=' +
              $(this).attr('product_id') +
              '&pg=' +
              QFP.Run.ViewName.replace('.', '-') +
              '&label=' +
              $(this).attr('e-label'),
            popup: true,
            width: 520,
            height: 400,
          });
        },
      })
      .each(function() {
        $(this).attr('href', 'javascript://');
      });
  }

  return {
    settings: settings,
    init: init,
    show: add,
    showInfo: add,
    showAlert: showAlert,
    showSuccess: showSuccess,
    showError: showError,
    showPopup: showPopup,
    showMixed: showMixed,
    showTopBanner: showTopBanner,
    hide: hide,
    remove: remove,
    getAll: getAll,
    Controllers: {},
    pendingNotifications: pending_notifications,
    pendingPopups: pending_popups,
    purchaseUpgrade: purchaseUpgrade,
  };
})();
$(QFP.Controllers.Layout.Notifications.init);
