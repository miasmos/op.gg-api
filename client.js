'use strict'
let parse = require('./lib/Parser/Parser'),
    errorMessages = require('./lib/Responses/error_messages.json'),
    responseCodes = require('./lib/Responses/response_codes.json'),
    Error = require('./lib/Responses/Error'),
    response = require('./lib/Responses/Response'),
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
        callback(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST), undefined)
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
          if (!validated) reject(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST))
          else resolve(parse.Live(region, this.api_key))
      })
    }
  }

  Renew(region, summonerId, callback) {
    let validated = {
      region: validate.Region(region),
      summonerId: validate.SummonerId(summonerId)
    }

    if (typeof callback === 'function') {
      if (!validated.region) {
        callback(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST), undefined)
        return
      } else if (!validated.summonerId) {
        callback(new Error(errorMessages.INVALID_PARAM_SUMMONER_ID, responseCodes.BAD_REQUEST), undefined)
        return
      }

      parse.Renew(region, summonerId, this.api_key)
        .then((json) => {
          callback(undefined, json)
        })
        .catch((error) => {
          callback(error, undefined)
        })
    } else {
      return new Promise((resolve, reject) => {
          if (!validated.region) reject(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST))
          if (!validated.summonerId) reject(new Error(errorMessages.INVALID_PARAM_SUMMONER_ID, responseCodes.BAD_REQUEST))
          else resolve(parse.Renew(region, summonerId, this.api_key))
      })
    }
  }
}