'use strict'
var Endpoint = require('./Endpoint'),
	cheerio = require('cheerio'),
	Error = require('../Responses/Error'),
	errorMessages = require('../Responses/error_messages.json'),
	responseCodes = require('../Responses/response_codes.json')

module.exports = class RenewEndpoint extends Endpoint {
	Path() {
		return '/summoner/ajax/renew.json/'
	}

	Parse($, json) {
		if (!!json) {
			return json
		} else if (!!$) {
			return new Error(errorMessages.RATE_LIMITED, responseCodes.TOO_MANY_REQUESTS)
		} else {
			return new Error(errorMessages.INVALID_RESPONSE, responseCodes.ERROR)
		}
	}
}