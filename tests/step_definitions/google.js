// features/step_definitions/google.js

const {client} = require('nightwatch-cucumber');
const {defineSupportCode} = require('cucumber');

defineSupportCode(({Given, Then, When}) => {
  Given(/^I open Google's search page$/, () => {
    return client
      .url('http://google.com')
      .waitForElementVisible('body', 1000);
  });

  When(/^I type "([^"]*)" in the search form$/, (searchTerms) => {
    return client.assert.visible('input[type=text]')
      .setValue('input[type=text]', searchTerms)
      .waitForElementVisible('button[name=btnG]', 1000)
      .click('button[name=btnG]')
      .pause(1000);
    //return client.assert.title(title);
  });

  Then(/^the title is "([^"]*)"$/, (title) => {
    return client.assert.title(title);
  });

  Then(/^the Google search form exists$/, () => {
    return client.assert.visible('input[name="q"]');
  });
  Then(/^the first result contains "([^"]*)"$/, (resultText) => {
    return client.waitForElementPresent('div#rso h3:first-child', 5000).assert.containsText('div#rso h3:first-child', resultText)
      ;//.end();
  });

});
