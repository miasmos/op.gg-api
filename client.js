'use strict'
let parse = require('./lib/parse'),
    error = require('./lib/error.json'),
    response = require('./lib/response'),
    validate = require('./lib/validate'),
    Promise = require('bluebird')


module.exports = class opgg {
  constructor(opts) {
    if (!opts) opts = {}
    this.api_key = opts.api_key ? opts.api_key : undefined
    if (!!this.api_key && !validate.RiotAPIKey(this.api_key)) throw new Error(error.INVALID_API_KEY)
  }

  Live(region, callback) {
    let validated = validate.Region(region)

    if (typeof callback === 'function') {
      if (!validated) {
        callback(Error.INVALID_PARAM_REGION, undefined)
        return
      }

      parse.Live(region, this.api_key)
        .then((json) => {
          callback(undefined, json)
        })
        .catch((error) => {
          callback(error, undefined)
        })
    } else {
      return new Promise((resolve, reject) => {
          if (!validated) reject(Error.INVALID_PARAM_REGION)
          else resolve(parse.Live(region, this.api_key))
      })
    }
  }
}