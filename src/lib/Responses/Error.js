'use strict'
module.exports = class ErrorExtended extends Error {
	constructor(message, code, fileName, lineNumber) {
		super(message, fileName, lineNumber)
		this.code = code
	}
}