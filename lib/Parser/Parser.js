'use strict'
let request = require('request-promise'),
	Promise = require('bluebird'),
	cheerio = require('cheerio'),
	Error = require('../Responses/Error'),
	errorMessages = require('../Responses/error_messages.json'),
	responseCodes = require('../Responses/response_codes.json'),
	riot = require('../riot'),
	LiveEndpoint = new (require('./LiveEndpoint')),
	RenewEndpoint = new (require('./RenewEndpoint'))

class Parser {
	constructor() {
		this.apiList = {}
	}

	Live(region, key) {
		if (!!key) this.SpawnAPI(key)

		return new Promise((resolve, reject) => {
			LiveEndpoint.Request({region})
				.then((response) => {
					if (response instanceof Error) {
						reject(response)
						return
					}

					if (!!key) {
						this.apiList[key].Champions()
							.then((champions) => {
								if (!!champions) {
									response = response.map((item) => {
										let champKey = item.champion.name.replace(/\s/g, '')
										if (champKey in champions) {
											item.champion.id = 'id' in champions[champKey] ? champions[champKey].id : undefined
											item.champion.title = 'title' in champions[champKey] ? champions[champKey].title : undefined
										}
										return item
									})
								}
								resolve(response)
							})
							.catch((error) => {
								reject(error)
							})
					} else {
						resolve(response)
					}
				})
				.catch((error) => {
					reject(error)
				})
		})
	}

	Renew(region, summonerId) {
		return new Promise((resolve, reject) => {
			RenewEndpoint.Request({region, summonerId})
				.then((response) => {
					if (response instanceof Error) {
						reject(response)
					} else {
						resolve(response)
					}
				})
				.catch((error) => {
					reject(error)
				})
		})
	}

	SpawnAPI(key) {
		//spawns a new api if it doesn't already exist, indexed by api key
		if (!(key in this.apiList)) {
			this.apiList[key] = new riot({key: key})
		}
	}
}

module.exports = new Parser()