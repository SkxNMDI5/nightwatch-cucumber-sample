
This project attempts to provide a quick working sample of Nightwatch with Cucumber tests.

Based on the great work done on :
 * [Cucumber JS](https://github.com/cucumber/cucumber-js)
 * [Nightwatch Cucumber](https://github.com/mucsi96/nightwatch-cucumber)
 * [Cucumber HTML Reporter](https://www.npmjs.com/package/cucumber-html-reporter)
 * [Cucumber Junit](https://www.npmjs.com/package/cucumber-junit)
 * Selenium, ChromeDriver, GeckoDriver
 * and all the tools needed by these ones

Thanks to you guys !


Disclosure :
_Only tested with Chrome (58) and Firefox (54) on Windows._


# about those tools

## Cucumber.js Guides

![Cucumber](https://github.com/cucumber/cucumber/raw/master/docs/images/single-source-of-truth-256x256.png)

[Cucumber.js](https://github.com/cucumber/cucumber-js)
  * [Hooks](https://github.com/cucumber/cucumber-js/blob/master/docs/support_files/hooks.md)
  * [Event Handlers](https://github.com/cucumber/cucumber-js/blob/master/docs/support_files/event_handlers.md)

[View the project on Github](https://github.com/cucumber/cucumber-js)

## Nightwatch Guides

___WARNING__ : the nightwatch-cucumber module [promisify](http://exploringjs.com/es6/ch_promises.html) the nightwatch API. Be carfeful of always use and return promises in your steps definitions._

![Nightwatch.js](http://nightwatchjs.org/img/logo-nightwatch.png)

[Nighwatch.js Developer Guide](http://nightwatchjs.org/guide)
  * [Page objects](http://nightwatchjs.org/guide#page-objects)

[Nighwatch.js API Reference](http://nightwatchjs.org/guide)

[View the project on Github](https://github.com/nightwatchjs/nightwatch)

## Nightwatch and cucumber integration
The [nightwatch-cucumber](https://github.com/mucsi96/nightwatch-cucumber) Project

### How do they fit together and what do you have to develop ?
![Integration](doc/Cucumber_JS_NightWatch_components.png)


# About this sample
It runs the cucumber features defined in the ```tests/features``` folder.

Those are "Human Behavior on Browser" features.

After run, you can view :
  * the generated HTML reports in the ```reports``` folder. Tools used for generation : [Cucumber HTML Reporter](https://www.npmjs.com/package/cucumber-html-reporter) and  [Cucumber Junit](https://www.npmjs.com/package/cucumber-junit)
  * the generated documentation in the ```doc``` folder.

# Installation and configuration

Simply run :
```sh
npm install
```

## Browser drivers

In case of annoying issues because of proxies or anything else when installing, you can provide the urls or paths of the drivers.

Chromedriver AND NOW geckodriver support CDN Urls :
 * GECKODRIVER_CDNURL
   * ```GECKODRIVER_CDNURL=https://INTERNAL_CDN/geckodriver/download```
   * [more infos](https://www.npmjs.com/package/geckodriver)
 * CHROMEDRIVER_CDNURL
   * ```CHROMEDRIVER_CDNURL=https://npm.taobao.org/mirrors/chromedriver npm install chromedriver```
* with local file path : ```CHROMEDRIVER_FILEPATH=/path/to/chromedriver_mac64.zip```
   * [more infos](https://www.npmjs.com/package/chromedriver)


On other platforms than Windows, for local tests, the paths indicated in the options of the ```nightwatch.conf.js``` file need to be adapted with the linux equivalent (without the .cmd at the end of the filenames):
```js
cli_args: {
      'webdriver.gecko.driver': './node_modules/.bin/geckodriver.cmd',
      'webdriver.chrome.driver': './node_modules/.bin/chromedriver.cmd',
    },
```
to be replaced with :
```js
cli_args: {
      'webdriver.gecko.driver': './node_modules/.bin/geckodriver',
      'webdriver.chrome.driver': './node_modules/.bin/chromedriver',
    },
```

### Remote Selenium Server or Grid

See below to how use env vars for the selenium server or adapt the ```nightwatch.conf.js``` file with your settings for more persistent changes :

```js
// remote selenium server
  nightwatchConf.test_settings.default.selenium_host = 'your_remote_selenium_server';
  nightwatchConf.test_settings.default.selenium_port = 4444;
```

# Launch the tests

By default on Chrome local in standalone mode (no selenium server, no java required) :
```sh
npm run test
# equivalent
npm run test:localchrome
```

## local selenium server
for firefox :
```sh
npm run test:localfirefox
```

## remote selenium server
```sh
npm run test:chrome
```
or
```sh
npm run test:firefox
```


## With some debug :
```sh
DEBUG=* npm run test
```

## Run only some tags

```sh
# run only the Features or Scenarios annotated by @Useful
TAGS='@Useful' npm test
```
View the full documentation of [Tags Syntax](https://docs.cucumber.io/tag-expressions/)

Other examples :
```sh
# run only the Features or Scenarios annotated by @Useful and @LessUseful
TAGS='@Useful and @LessUseful' npm test
# don't run the Features or Scenarios annotated by @LessUseful
TAGS='not @LessUseful' npm test
```

## Available Options :

### Remote Selenium Server
Use env vars
```js
SELENIUM_HOST=my_server_host SELENIUM_PORT=my_server_port npm test
```

_those options are not used in case of localfirefox or localchrome profiles_

### Parallel mode
Execute on 3 browsers in parallel :
```sh
PARALLEL=true PARALLEL_NB_UNITS=3 npm test
```

### Nightwatch Timeout

from [Nightwatch-cucumber timeouts](https://github.com/mucsi96/nightwatch-cucumber#timeouts)

__DEFAULT_TIMEOUT__ is expressed in seconds.

Execute Test with a timeout for nightwatch actions of 15 seconds :
```sh
DEFAULT_TIMEOUT=15 npm test
```

_Defaults to : 20 seconds._

### Multi-Environments execution
Use the ```tests/env``` folder to declare your environments : one js file by environment.

Use this feature to define configuration options that will be available in your tests under the config object.

To run under an environment :
```sh
ENV=MYENV npm test
```

It supposes that you created a MYENV.js file.

Sample :

```js
'use strict';

const config = {
  users: {
    'VIP': {
      login: 'john@doe.com',
      password: 'super_password',
    }
  },
};

module.exports = config;

```

Then import the config.js in steps definitions or Page Objects :
```js
const config = require('../support/config');
...
...
  authenticate(config.users['VIP'].login, config.users['VIP'].password);
...

```
_using globals could avoid to import the config in each js_

### A Full multi-options example :
Execute the Features or Scenarios :
  * tagged @Useful
  * on 2 Firefox browsers in parallel
  * controlled by the selenium server "my_server_host" on port "my_server_port"
  * against an environment called MYENV
  * with DEBUG logs activated on all packages
  * and a timeout for nightwatch of 10 seconds

```sh
TAGS='@Useful' PARALLEL=true PARALLEL_NB_UNITS=2 SELENIUM_HOST=my_server_host SELENIUM_PORT=my_server_port DEFAULT_TIMEOUT=10 ENV=MYENV DEBUG=* npm test:firefox
```

# Reports
After run, 3 reports are available in the ```reports``` directory :
 * json format : ```reports/cucumber.json```
 * html format : ```reports/cucumber_report.html```
 * JUnit XML format : ```reports/cucumber.junit.xml```


## Screenshots
Screenshots are generated for each Scenario if they failed or even if they passed.
They are automatically integrated in the reports (base64 embedded images).

# Living Documentation
After run, an HTML documentation of all the features is available from here : ```doc/index.html```


# Troubleshooting

## Java Version Error when launching the local selenium server

### Stack trace
```js
> nightwatch --env chrome || ( node cucumber-report.js && npm run report:junit )

Starting selenium server... There was an error while starting the Selenium server:

java.lang.UnsupportedClassVersionError: org/openqa/grid/selenium/GridLauncherV3 : Unsupported major.minor version 52.0
        at java.lang.ClassLoader.defineClass1(Native Method)
        at java.lang.ClassLoader.defineClass(Unknown Source)
        at java.security.SecureClassLoader.defineClass(Unknown Source)
        at java.net.URLClassLoader.defineClass(Unknown Source)
        at java.net.URLClassLoader.access$100(Unknown Source)
        at java.net.URLClassLoader$1.run(Unknown Source)
        at java.net.URLClassLoader$1.run(Unknown Source)
        at java.security.AccessController.doPrivileged(Native Method)
        at java.net.URLClassLoader.findClass(Unknown Source)
        at java.lang.ClassLoader.loadClass(Unknown Source)
        at sun.misc.Launcher$AppClassLoader.loadClass(Unknown Source)
        at java.lang.ClassLoader.loadClass(Unknown Source)
        at sun.launcher.LauncherHelper.checkAndLoadMain(Unknown Source)
Exception in thread "main"
module.js:472
    throw err;
    ^
```

#### Cause : The __JVM 1.8__ is required to run the local selenium server.
Execute the command to check the current resolved JVM :
```sh
java -version
```

#### Resolution : Change the JVM version
 * If not installed, you need to install a jdk 1.8.
 * If installed, you need to change the PATH environment variable.

```sh
export JAVA_HOME=path_to_jdk1.8
export PATH=$JAVA_HOME/bin:$PATH
```
