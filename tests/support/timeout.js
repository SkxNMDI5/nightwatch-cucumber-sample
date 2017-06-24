'use strict';

const {defineSupportCode} = require('cucumber');
const defaultTimeoutInS = process.env.DEFAULT_TIMEOUT || 20;

defineSupportCode(({setDefaultTimeout}) => {
  setDefaultTimeout(defaultTimeoutInS * 1000);
});
