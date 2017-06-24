var debug = require('debug')('tests:globals');
var chromedriver = require('chromedriver');
module.exports = {
  before : function(done) {
    debug("START STANDALONE CHROMEDRIVER");
    chromedriver.start();
    done();
  },

  after : function(done) {
    debug("STOP STANDALONE CHROMEDRIVER");
    chromedriver.stop();
    done();
  }
};
