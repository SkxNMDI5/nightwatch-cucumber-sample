'use strict';

const debug = require('debug')('tests:config');
let config = {};

if(typeof process.env.ENV !== 'undefined') {
  config = require('../env/' + process.env.ENV + '.js');
} else {
  config = require('../env/localhost.js');
  // search for local ip address (local dev server tests on port 80)
  const os = require('os');
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for(let k in interfaces) {
      for(let k2 in interfaces[k]) {
          const address = interfaces[k][k2];
          if (address.family === 'IPv4' && !address.internal) {
              addresses.push(address.address);
          }
      }
  }
  const localIp = addresses[0];
  config.target_host= process.env.target_host || 'http://' + localIp;
}

debug(JSON.stringify(config));

module.exports = config;
