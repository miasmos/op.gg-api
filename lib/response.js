'use strict'
module.exports = class Response {
	static Make(data, error) {
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