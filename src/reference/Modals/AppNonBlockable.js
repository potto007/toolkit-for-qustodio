/**
 * @author Alejandro Camps <alex.camps@qustodio.com>
 */

QFP.Modals.AppNonBlockable = QFP.Modals.Extend({
  template: '#app-non-blockable-tmpl',
  width: 750,
  required: ['appName'],
  getViewObj: function() {
    this.msg = Mustache.render(QFP.lng('_strIosAppsBlockability'), { appName: this.appName });
    return this;
  },
});
