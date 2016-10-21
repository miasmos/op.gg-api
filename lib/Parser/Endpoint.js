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

	Request(params) {
		if (!params) params = {}

		//actually makes the request and makes sure the data is valid
		return new Promise((resolve, reject) => {
			if ('region' in params) {
				this.baseURI = this.baseURI.replace('region', params.region)
			} else {
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

					var response = this.Parse($, json)

					if (response instanceof Error) {
						reject(response)
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
						resolve(new Error(errorMessages.RATE_LIMITED, responseCodes.TOO_MANY_REQUESTS))
					} else {
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
		var uri = this.baseURI + this.Path(),
			didHaveParams = false
		for (var i in this.Params()) {
			if (i == 0) uri += '?'
			if (i !== 'region') {
				uri += i + '=' + this.Params()[i] + '&'
				didHaveParams=true
			}
		}
		for (var i in params) {
			if (i == 0 && !didHaveParams) uri += '?'
			if (i !== 'region') uri += i + '=' + params[i] + '&'
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