'use strict'
var Endpoint = require('./Endpoint'),
	cheerio = require('cheerio'),
	Error = require('../Responses/Error'),
	errorMessages = require('../Responses/error_messages.json'),
	responseCodes = require('../Responses/response_codes.json')

module.exports = class MatchEndpoint extends Endpoint {
	Path() {
		return '/summoner/matches/ajax/detail/'
	}

	Parse($, json) {
		var data = {"test":true},
			recent = {}


		  return data
	}
}