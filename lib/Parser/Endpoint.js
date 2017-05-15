'use strict'

let request = require('request-promise'),
	Promise = require('bluebird'),
	cheerio = require('cheerio'),
	Error = require('../Responses/Error'),
	errorMessages = require('../Responses/error_messages.json'),
	responseCodes = require('../Responses/response_codes.json'),
	riot = require('../riot')

module.exports = class Endpoint {
	constructor() {
		this.baseURI = 'http://region.op.gg'
		this.headers = {
			'Content-Type': 'text/html',
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36',
			'Accept-Language': 'en-GB,en-US;q=0.8,en;q=0.6'
		}
	}

	Path() {
		return ''
	}

	Filter(json) {
		return json
	}

	Parse($) {
		return new Promise((resolve, reject) => {reject(new Error('Parse function not implemented on this instance of Endpoint'))})
	}

	ErrorCheck($) {
		return false
	}

	Request(params) {
		if (!params) params = {}

		//actually makes the request and makes sure the data is valid
		return new Promise((resolve, reject) => {
			if (!('region' in params)) {
				reject(new Error(errorMessages.MISSING_PARAM_REGION))
				return
			}

			request(this.Options(params))
				.then((html) => {
					var $ = undefined,
						json = undefined

					try {
						json = JSON.parse(html)
					} catch(e) {
						try {
							$ = cheerio.load(html)
						} catch(e1) {
							reject(new Error(errorMessages.INVALID_RESPONSE))
							return
						}
					}

					var error = this.ErrorCheck($)
					if (error instanceof Error) {
						console.error(response)
						reject(error)
						return
					}

					var response = this.Parse($, json)
					if (response instanceof Error) {
						console.error(response)
						reject(response)
						return
					} else {
						if ((Array.isArray(response) && !response.length) || (!Array.isArray(response) && !Object.keys(response).length)) {
							reject(new Error(errorMessages.EMPTY_RESPONSE))
						} else if (typeof response === 'string') {
							reject(new Error(errorMessages.INVALID_RESPONSE))
						} else {
							response = this.Filter(response)

							if (response instanceof Error) {
								reject(response)
							} else {
								resolve(response)
							}
						}
					}
				})
				.catch((error) => {
					if (error.statusCode == 418) {
						resolve(new Error(errorMessages.NO_RESULTS, responseCodes.NO_RESULTS))
					} else if (error.statusCode == 503) {
						resolve(new Error(errorMessages.SERVICE_UNAVAILABLE, responseCodes.SERVICE_UNAVAILABLE))
					} else {
						console.error(error)
						reject(new Error(error.message, error.statusCode))
					}
				})
		})
	}

	Options(params) {
		//returns a valid options object for request
		console.log(this.Uri(params))

		return {
			headers: this.headers,
			uri: this.Uri(params)
		}
	}

	Uri(params) {
		//returns an encoded uri including query strings
		if (!params) params = {}
		var path = this.Path(),
			regex = path.match(/\/:[a-zA-Z]*/g),
			ignore = []

		//replace any variables in this.Path() with passed or inherited parameters
		for (var i in regex) {
			var key = regex[i].replace('/:', '')

			if (key in params && typeof params[key] !== 'undefined') {
				path = path.replace(regex[i], "/"+params[key])
				ignore.push(key)  //if it's used in the path, don't append it as a query string
			} else if (key in this.Params() && typeof this.Params()[key] !== 'undefined') {
				path = path.replace(regex[i], "/"+this.Params()[key])
			} else {
				throw new Error(errorMessages.MISSING_PARAM_GENERIC, responseCodes.BAD_REQUEST)
				return
			}
		}

		var uri = this.baseURI.replace('region', params.region) + path,
			didHaveParams = false,
			i = 0

		//append query strings from inherited parameters
		for (var key in this.Params()) {
			var value = this.Params()[key]
			if (key !== 'region' && (!(key in params) || key in params && typeof params[key] === 'undefined')) {
				if (i == 0) uri += '?'
				uri += key + '=' + encodeURIComponent(value) + '&'
				didHaveParams=true
				i++
			}
		}
		i = 0

		//append query strings from passed parameters
		for (var key in params) {
			var value = params[key]
			if (ignore.indexOf(key) == -1) {
				if (i == 0 && !didHaveParams) uri += '?'
				if (key !== 'region' && typeof value !== 'undefined') uri += key + '=' + encodeURIComponent(value) + '&'
				i++
			}
		}
		return uri
	}

	Params() {
		return {}
	}

	Strip(str) {
		//strips newlines from a string
		return !!str ? str.replace(/\n|\r|\t/g, '') : undefined
	}
}