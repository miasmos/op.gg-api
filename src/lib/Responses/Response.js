'use strict'

var responseCodes = require('./response_codes.json'),
	errorMessages = require('./error_messages.json')

module.exports = class Response {
	static Ok(res, data) {
		return this.Make(res, data, undefined)
	}

	static Error(res, error) {
		return this.Make(res, undefined, error)
	}

	static Make(res, data, error) {
		if (typeof error !== 'undefined') {
			res.status(error.code || responseCodes.ERROR)
				.json({
					status: error.code || responseCodes.ERROR,
					error: error.message || errorMessages.GENERIC_ERROR,
					data: {}
				})
		} else {
			res.status(responseCodes.OK)
				.json({
					status: responseCodes.OK,
					data: data
				})
		}
	}
}