'use strict'
let parse = require('./lib/parse'),
    error = require('./lib/error.json'),
    response = require('./lib/response'),
    validate = require('./lib/validate'),
    Promise = require('bluebird')


module.exports = class opgg {
  static Live(region, callback) {
    let validated = validate.Region(region)

    if (typeof callback === 'function') {
      parse.Live(region)
        .then((json) => {
          callback(undefined, json)
        })
        .catch((error) => {
          callback(error, undefined)
        })
    } else {
      return new Promise((resolve, reject) => {
          if (!validated) reject(Error.INVALID_PARAM_REGION)
          else resolve(parse.Live(region))
      })
    }
  }
}