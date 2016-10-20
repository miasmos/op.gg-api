'use strict'

var responseCodes = require('./response_codes.json'),
	errorMessages = require('./error_messages.json')

module.exports = class Response {
	static Ok(data) {
		return this.Make(data, undefined)
	}

	static Error(error) {
		return this.Make(undefined, error)
	}

	static Make(data, error) {
		if (typeof error !== 'undefined') {
			return {
				status: error.code || responseCodes.ERROR,
				error: error.message || errorMessages.GENERIC_ERROR,
				data: {}
			}
		} else {
			return {
				status: responseCodes.OK,
				data: data
			}
		}
	}
}