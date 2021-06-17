'use strict'
var SummaryRankedEndpoint = require('./SummaryRankedEndpoint'),
	cheerio = require('cheerio'),
	Error = require('../Responses/Error'),
	errorMessages = require('../Responses/error_messages.json'),
	responseCodes = require('../Responses/response_codes.json')

module.exports = class SummaryNormalEndpoint extends SummaryRankedEndpoint {
	Params() {
		return {
			type: 'normal'
		}
	}
}