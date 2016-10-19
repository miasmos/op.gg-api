'use strict'
module.exports = class Response {
	static Make(error, data) {
		if (typeof error !== 'undefined') {
			return {
				status: "error",
				error: error.message || error,
				data: {}
			}
		} else {
			return {
				status: "ok",
				data: data
			}
		}
	}
}