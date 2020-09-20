'use strict'

const omit = require('lodash.omit')

const browserDefinitions = {
  chrome: {
    regex: /Google Chrome (\S+)/,
    profile: true,
    variants: {
      chrome: ['google-chrome', 'google-chrome-stable'],
      'chrome-beta': ['google-chrome-beta'],
      'chrome-dev': ['google-chrome-unstable'],
      'chrome-canary': ['google-chrome-canary']
    }
  },
  chromium: {
    regex: /Chromium (\S+)/,
    profile: true,
    variants: {
      chromium: ['chromium', 'chromium-browser'],
      'chromium-dev': ['chromium-dev']
    }
  },
  firefox: {
    regex: /Mozilla Firefox (\S+)/,
    profile: true,
    variants: {
      firefox: ['firefox'],
      'firefox-developer': ['firefox-developer'],
      'firefox-nightly': ['firefox-nightly']
    }
  },
  phantomjs: {
    regex: /(\S+)/,
    profile: false,
    headless: true
  },
  safari: {
    profile: false
  },
  ie: {
    profile: false
  },
  msedge: {
    regex: /Microsoft Edge (\S+)/,
    profile: true,
    variants: {
      msedge: ['msedge'],
      'msedge-beta': ['msedge-beta'],
      'msedge-canary': ['msedge-canary']
    }
  },
  brave: {
    regex: /Brave Browser (\S+)/,
    profile: true,
    variants: {
      brave: ['brave-browser', 'brave'],
      'brave-beta': ['brave-browser-beta', 'brave-beta'],
      'brave-dev': ['brave-browser-dev', 'brave-dev'],
      'brave-nightly': ['brave-browser-nightly', 'brave-nightly']
    }
  },
  opera: {
    regex: /Opera (\S+)/,
    profile: true
  }
}

/**
* Used to get browser information and configuration. By default, uses internal browser list
* @param {Array} [browserList] list of browsers, configuration and variants
* @constructor
*/
function Browsers (browserList) {
  this.browserList = browserList || browserDefinitions
}

/**
* Compiles each browser into the relevant data for Linux or Darwin. The structure of each object returned is:
*  type: type of browser, e.g.: "chrome", "chromium", "ie"
*  darwin: name of browser, used to look up "darwin detector" (see "./darwin" folder)
*  linux: array of commands that the browser might run as on a 'nix environment
*  regex: extracts version code when browser is run as a command
*
* @returns {Array} list of browser data
*/
Browsers.prototype.browserPlatforms = function browserPlatforms () {
  const _browsers = []
  const browsers = this.browserList

  Object.keys(browsers).forEach(function convertDefinitions (type) {
    const regex = browsers[type].regex
    const variants = browsers[type].variants

    if (!variants) {
      return _browsers.push({
        type: type, darwin: type, linux: [type], regex: regex
      })
    }

    Object.keys(variants).map(function convertVariants (name) {
      return _browsers.push({
        type: type, darwin: name, linux: variants[name], regex: regex
      })
    })
  })

  return _browsers
}

/**
* Returns the configuration for the browser type specified
* @param {String} type type of browser
* @returns {Object} config for the specified browser type
*/
Browsers.prototype.typeConfig = function typeConfig (type) {
  return omit(this.browserList[type], 'variants')
}

module.exports = Browsers
