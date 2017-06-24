var reporter = require('cucumber-html-reporter');
var debug = require('debug')('tests:reports');

var executionEnv = undefined;
try {
  executionEnv = require('./tmp/generated-env.json');
}
catch (e) {
 console.log(e)
}
var npmConfig = require("./package.json");
var nightwatchConf = require("./nightwatch.conf.js");

// COMPUTE METADATA
var browser = "unknown";
var driver = "unknown";
if(executionEnv !== undefined) {
if (typeof executionEnv.browserName != "undefined") {
    browser = "Firefox " + executionEnv.browserVersion;
    driver = "Gecko Driver " + npmConfig.dependencies["geckodriver"];
}
if (typeof executionEnv.chrome != "undefined") {
    browser = "Chrome " + executionEnv.version;
    driver = "Chrome Driver " + npmConfig.dependencies["chromedriver"];
}
var platform = executionEnv.platform;
if(executionEnv.platformName && executionEnv.platformName.toLowerCase().includes("windows")) {
    var version = (executionEnv.platformVersion == "6.1")  ? "7" : executionEnv.platformVersion;
    platform = "Windows " + version;
}
}

var selenium_host = (typeof nightwatchConf.test_settings.default.selenium_host != 'undefined') ?
    nightwatchConf.test_settings.default.selenium_host : 'localhost';
var selenium_port = (typeof nightwatchConf.test_settings.default.selenium_port != 'undefined') ?
    nightwatchConf.test_settings.default.selenium_port : nightwatchConf.selenium.port;

var options = {
    theme: 'bootstrap',
    jsonFile: 'reports/cucumber.json',
    output: 'reports/cucumber_report.html',
    reportSuiteAsScenarios: true,
    launchReport: false,
    metadata: {
        "App Version":"0.3.2",
        "Test Environment": process.env.ENV || "Local",
        "Platform": platform,
        "Browser": browser,
        "Driver": driver.replace("\^", ""),
        "Selenium": npmConfig.dependencies["selenium-server"].replace("\^", ""),
        "Selenium Server": "http://" + selenium_host + ":" + selenium_port,
        //"Parallel": "Scenarios",
        //"Executed": "Remote"
    }
};

var parallel = "";
if(typeof nightwatchConf.test_workers != "undefined" && nightwatchConf.test_workers.enabled) {
    options.metadata["Parallel Execution"] = nightwatchConf.test_workers.workers + " units";
}


reporter.generate(options);
