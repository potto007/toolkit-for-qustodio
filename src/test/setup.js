import { Chrome } from 'toolkit/test/mocks/web-extensions/chrome';
import { Ember } from 'toolkit/test/mocks/ember';
import { allToolkitSettings } from 'toolkit/core/settings/settings';
import $ from 'jquery';

process.on('unhandledRejection', console.log.bind(console));

function resetConsoleSpies() {
  global.console = {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    log: jest.fn(),
    warn: jest.fn(),
  };
}

function resetWebExtensionsAPI() {
  let webExtensionsAPI = new Chrome();
  global.chrome = webExtensionsAPI;
  global.browser = webExtensionsAPI;
}

export function readyYNAB(options = {}) {
  const ember = new Ember();
  const toolkitOptions = allToolkitSettings.reduce((settings, current) => {
    settings[current.name] = false;
    return settings;
  }, {});

  global.Ember = ember;
  global.Em = ember;
  global.$ = $;
  global.ynabToolKit = options.ynabToolKit || { options: toolkitOptions };
}

export function unreadyYNAB() {
  global.Ember = undefined;
  global.Em = undefined;
  global.$ = undefined;
  global.ynabToolKit = undefined;
}

beforeEach(() => {
  resetConsoleSpies();
  resetWebExtensionsAPI();
  readyYNAB();

  localStorage.clear();
});

resetConsoleSpies();
resetWebExtensionsAPI();
readyYNAB();
