// Global Hooks
// Cucumber js Event Handlers :
// https://github.com/cucumber/cucumber-js/blob/master/docs/support_files/event_handlers.md
'use strict';

const debug = require('debug')('tests:hooks');

const {defineSupportCode} = require('cucumber');
const {client} = require('nightwatch-cucumber');
const EventEmitter = require('events');
const fs = require('fs');

defineSupportCode(function({registerHandler, Before, After}) {

  registerHandler('BeforeFeatures', function(features, done) {
    debug('Before Features');
    done();
  });

  registerHandler('AfterFeatures', function(features, done) {
    // clean up!
    // There is no World instance available on `this`
    // because all scenarios are done and World instances are long gone.
    debug('After Features');
    fs.writeFileSync('tmp/generated-env.json',
                     JSON.stringify(client.capabilities),
                     (err) => {
      if (err) throw err;
      debug('It\'s saved!');
    });
    done();
  });

  registerHandler('BeforeStep', function(step, done) {
    client.maximizeWindow();
    done();
  });

  registerHandler('AfterStep', function(step, done) {
    // looks like there is no World instance
    // available on `this` here too !!! :-(
    if(step.keyword != 'Before' && step.keyword != 'After' &&
        (step.keywordType == 'event' || step.keywordType == 'outcome')) {
      // debug("After Step");
      // debug(step.keyword);
    }
    done();
  });

  Before(function(scenarioResult, done) {
    debug('Before Scenario');
    const Base64 = require('js-base64').Base64;
    this.attach(Base64.encode('hé'), 'text/plain');
    done();
  });

  // the second argument "done" provides asynchronous execution
  After(function(scenarioResult, done) {
    debug('After Scenario');
    const runner = this;
    let serverError = false;
    if(scenarioResult.failureException) {
      serverError =
        scenarioResult.failureException.message.includes('Connection refused');
    }

    // if (!scenarioResult.isFailed())
    if(!serverError) {
      const myEmitter = new EventEmitter();
      myEmitter.on('done', () => {
        done();
      });
      client.saveScreenshot('tmp/tmp.png', function(result, err) {
        if(err == null) {
          debug('attach screenshot');
          runner.attach(result.value, 'image/png');
        }
        myEmitter.emit('done');
      }).then(function() {});
      // then is required for those async things to work ! strange !
    } else {
      debug('A server Error have been encountered');
      done();
    }
  });
});
