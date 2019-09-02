jest.useFakeTimers();
jest.mock('toolkit/extension/utils/qustodio');
jest.mock('toolkit/extension/listeners/observeListener');
jest.mock('toolkit/extension/listeners/routeChangeListener');
import {
  QustodioToolkit,
  TOOLKIT_LOADED_MESSAGE,
  TOOLKIT_BOOTSTRAP_MESSAGE,
} from './qustodio-toolkit';
import { allToolkitSettings } from 'toolkit/core/settings';
import { isQustodioReady } from 'toolkit/extension/utils/qustodio';
import { readyQustodio, unreadyQustodio } from 'toolkit/test/setup';

const setup = (setupOptions = {}) => {
  const options = {
    initialize: true,
    sendBootstrap: false,
    ...setupOptions,
  };

  let messageCallback;
  const addEventListenerSpy = jest
    .spyOn(window, 'addEventListener')
    .mockImplementation((event, callback) => {
      messageCallback = callback;
    });

  const postMessageSpy = jest.spyOn(window, 'postMessage');
  const callMessageListener = (...args) => {
    messageCallback.apply(null, args);
  };

  const qustodioToolkit = new QustodioToolkit();
  if (options.initialize) {
    qustodioToolkit.initializeToolkit();
  }

  const toolkitBootstrap = { options: {} };
  allToolkitSettings.forEach(setting => {
    toolkitBootstrap.options[setting.name] = false;
  });

  if (options.sendBootstrap) {
    callMessageListener({
      source: window,
      data: {
        type: TOOLKIT_BOOTSTRAP_MESSAGE,
        qustodioToolKit: toolkitBootstrap,
      },
    });
  }

  return {
    addEventListenerSpy,
    callMessageListener,
    postMessageSpy,
    toolkitBootstrap,
    qustodioToolkit,
  };
};

describe('QustodioToolkit', () => {
  beforeEach(() => {
    unreadyQustodio();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('.initializeToolkit()', () => {
    it('should attach a message listener to the window', () => {
      const { addEventListenerSpy, qustodioToolkit } = setup({ initialize: false });
      qustodioToolkit.initializeToolkit();
      expect(addEventListenerSpy).toHaveBeenCalledWith('message', expect.any(Function));
    });

    it('should postMessage the toolkit loaded message', () => {
      const { postMessageSpy, qustodioToolkit } = setup({ initialize: false });
      qustodioToolkit.initializeToolkit();
      expect(postMessageSpy).toHaveBeenCalledWith({ type: TOOLKIT_LOADED_MESSAGE }, '*');
    });
  });

  describe('once the TOOLKIT_BOOTSTRAP_MESSAGE is received', () => {
    it('should create the qustodioToolKit global object', () => {
      const { toolkitBootstrap } = setup({ sendBootstrap: true });
      expect(global.qustodioToolKit).toEqual(toolkitBootstrap);
    });

    it('should poll for Qustodio to be ready', () => {
      isQustodioReady.mockReturnValueOnce(false);

      const { toolkitBootstrap } = setup({ sendBootstrap: true });

      // first poll attempt
      jest.runOnlyPendingTimers();
      expect(global.qustodioToolKit.invokeFeature).toBeUndefined();

      // second poll attempt
      isQustodioReady.mockReturnValueOnce(false);
      jest.runOnlyPendingTimers();
      expect(global.qustodioToolKit.invokeFeature).toBeUndefined();

      // third poll attempt
      readyQustodio({ qustodioToolKit: toolkitBootstrap });
      isQustodioReady.mockReturnValueOnce(true);
      jest.runOnlyPendingTimers();
      expect(global.qustodioToolKit.invokeFeature).toEqual(expect.any(Function));
    });

    describe('once Qustodio is ready', () => {
      it('should set invokeFeature on the global qustodioToolKit object', () => {
        readyQustodio();
        isQustodioReady.mockReturnValueOnce(true);
        setup({ sendBootstrap: true });

        expect(qustodioToolKit.invokeFeature).toEqual(expect.any(Function));
      });

      it('should apply the globalCSS to the HEAD', () => {
        readyQustodio();
        isQustodioReady.mockReturnValueOnce(true);
        setup({ sendBootstrap: true });

        expect($('head #toolkit-injected-styles').length).toEqual(1);
      });
    });
  });
});
