const debug = require('debug')('tests:config');
const npmConfig = require('./package.json');

require('nightwatch-cucumber')({
  cucumberArgs: [
    '--require', 'tests/support/hooks.js',
    '--require', 'tests/support/timeout.js',
    '--require', 'tests/step_definitions',
    //'--format', 'progress',
    '--format', 'json:reports/cucumber.json',
    '--tags', process.env.TAGS || '',
    'tests/features',
  ],
});

let nightwatchConf = {
  // do not define those with nightwatch-cucumber
  //src_folders : ['tests/scenarios'],
  output_folder: 'reports',
  custom_commands_path: '',
  custom_assertions_path: '',
  page_objects_path: 'tests/page_objects',
  use_xpath: false,

  selenium: {
    start_process: false,
    server_path:
    'node_modules/selenium-server/lib/runner/selenium-server-standalone-'
      + npmConfig.dependencies['selenium-server'].replace('\^', '') + '.jar',
    log_path: '.',
    selenium_host: 'localhost',
    port: 4444,
    cli_args: {
      'webdriver.gecko.driver': './node_modules/.bin/geckodriver.cmd',
      'webdriver.chrome.driver': './node_modules/.bin/chromedriver.cmd',
    },
  },
  test_workers: {
    enabled: process.env.PARALLEL || false,
    workers: process.env.PARALLEL_NB_UNITS || 2,
  },
  test_settings: {
    default: {
        launch_url: 'about:blank',
        silent : true,
        end_session_on_fail: true,
        skip_testcases_on_fail: true,
        desiredCapabilities: {
          browserName: 'firefox',
          javascriptEnabled: true,
          acceptSslCerts: true,
          marionette: true,
        },
        screenshots: {
          enabled: true,
          on_error: true,
          on_failure: true,
          path: '/screenshots',
        },
        globals: {
          launchChrome: false,
        },
      },
      chrome: {
        desiredCapabilities: {
          browserName: 'chrome',
          javascriptEnabled: true,
          acceptSslCerts: true,
        },
      },
      localchrome: {
        desiredCapabilities: {
          browserName: 'chrome',
        },
        // standalone chromedriver
        selenium_port: 9515,
        selenium_host: 'localhost',
        default_path_prefix: '',
        globals: {
          launchChrome: true,
        },
      },
      firefox: {
        desiredCapabilities: {
          browserName: 'firefox',
        },
      },
      localfirefox: {
        desiredCapabilities: {
          browserName: 'firefox',
        },
      },
  },
};


let env = 'default';
for(let i=0; i<process.argv.length; i++) {
  if(process.argv[i] == '--env') {
      env = process.argv[i+1];
  }
}
if (env == 'localfirefox') {
  nightwatchConf.selenium.start_process = true;
} else if (env == 'localchrome') {
  nightwatchConf.globals_path = 'tests/globals/chromedriver.js';
} else if (env != 'default') {
  // remote selenium server
  nightwatchConf.test_settings.default.selenium_host = process.env.SELENIUM_HOST || 'your_remote_selenium_server';
  nightwatchConf.test_settings.default.selenium_port = process.env.SELENIUM_PORT || 4444;
}

debug(nightwatchConf);

module.exports = nightwatchConf;
