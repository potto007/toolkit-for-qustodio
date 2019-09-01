import { features } from 'toolkit/extension/features';
import * as qustodioUtils from 'toolkit/extension/utils/qustodio';
import * as emberUtils from 'toolkit/extension/utils/ember';
import * as Collections from 'toolkit/extension/utils/collections';
import { isFeatureEnabled } from 'toolkit/extension/utils/feature';
import { logToolkitError, withToolkitError } from 'toolkit/core/common/errors/with-toolkit-error';

export const TOOLKIT_LOADED_MESSAGE = 'qustodio-toolkit-loaded';
export const TOOLKIT_BOOTSTRAP_MESSAGE = 'qustodio-toolkit-bootstrap';

window.__toolkitUtils = {
  ...qustodioUtils,
  ...emberUtils,
  ...Collections,
};

export class QustodioToolkit {
  _featureInstances = [];

  initializeToolkit() {
    window.addEventListener('message', this._onBackgroundMessage);
    window.postMessage({ type: TOOLKIT_LOADED_MESSAGE }, '*');
  }

  _applyGlobalCSS() {
    const globalCSS = this._featureInstances.reduce((css, feature) => {
      const wrappedInjectCSS = withToolkitError(feature.injectCSS.bind(feature), feature);
      const featureCSS = wrappedInjectCSS();

      if (isFeatureEnabled(feature) && featureCSS) {
        css += `/* == Injected CSS from feature: ${
          feature.constructor.name
        } == */\n${featureCSS}\n\n`;
      }

      return css;
    }, require('./qustodio-toolkit.css'));

    $('head').append(
      $('<style>', { id: 'toolkit-injected-styles', type: 'text/css' }).text(globalCSS)
    );
  }

  _createFeatureInstances() {
    features.forEach(Feature => {
      this._featureInstances.push(new Feature());
    });
  }

  _invokeFeature = featureName => {
    const feature = this._featureInstances.find(f => f.constructor.name === featureName);
    const wrappedShouldInvoke = feature.shouldInvoke.bind(feature);
    const wrappedInvoke = feature.invoke.bind(feature);
    if (isFeatureEnabled(feature) && wrappedShouldInvoke()) {
      wrappedInvoke();
    }
  };

  _invokeFeatureInstances = async () => {
    this._featureInstances.forEach(async feature => {
      if (isFeatureEnabled(feature)) {
        feature.applyListeners();

        try {
          await feature.willInvoke();
        } catch (exception) {
          const featureName = feature.constructor.name;
          const featureSetting = qustodioToolKit.options[featureName];
          logToolkitError({
            exception,
            featureName,
            featureSetting,
            functionName: 'willInvoke',
          });
        }

        const wrappedShouldInvoke = withToolkitError(feature.shouldInvoke.bind(feature), feature);
        const wrappedInvoke = withToolkitError(feature.invoke.bind(feature), feature);
        if (wrappedShouldInvoke()) {
          wrappedInvoke();
        }
      }
    });
  };

  _onBackgroundMessage = event => {
    if (event.source === window && event.data.type === TOOLKIT_BOOTSTRAP_MESSAGE) {
      window.qustodioToolKit = {
        ...window.qustodioToolKit,
        ...event.data.qustodioToolKit,
      };

      // eslint-disable-next-line
      if (event.data.qustodioToolKit.environment === 'development') {
        try {
          Rollbar.impl.instrumenter.deinstrumentConsole(); // eslint-disable-line
        } catch (e) {
          /* ignore */
        }
      }

      this._setupErrorTracking();
      this._createFeatureInstances();
      this._removeMessageListener();
      this._waitForUserSettings();
    }
  };

  _removeMessageListener() {
    window.removeEventListener('message', this._onBackgroundMessage);
  }

  _setupErrorTracking = () => {
    window.addEventListener('error', ({ error }) => {
      let serializedError = '';
      if (error.message && error.stack) {
        serializedError = `${error.message}\n${error.stack.toString()}`;
      } else if (error.message) {
        serializedError = error.message;
      }

      if (serializedError.includes(window.qustodioToolKit.extensionId)) {
        logToolkitError({
          exception: error,
          featureName: 'unknown',
          featureSetting: 'unknown',
          functionName: 'global',
        });
      }
    });
  };

  _waitForUserSettings() {
    const self = this;

    (function poll() {
      if (qustodioUtils.isQustodioReady()) {
        // add a global invokeFeature to the global qustodioToolKit for legacy features
        // once legacy features have been removed, this should be a global exported function
        // from this file that features can require and use
        qustodioToolKit.invokeFeature = self._invokeFeature;

        // inject the global css from each feature into the HEAD of the DOM
        self._applyGlobalCSS();

        // Hook up listeners and then invoke any features that are ready to go.
        self._invokeFeatureInstances();
      } else if (typeof Ember !== 'undefined') {
        Ember.run.later(poll, 250);
      } else {
        setTimeout(poll, 250);
      }
    })();
  }
}
