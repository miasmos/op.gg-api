'use strict'
let request = require('request-promise'),
	Promise = require('bluebird'),
	cheerio = require('cheerio'),
	Error = require('../Responses/Error'),
	errorMessages = require('../Responses/error_messages.json'),
	responseCodes = require('../Responses/response_codes.json'),
	riot = require('../riot'),
	LiveEndpoint = new (require('./LiveEndpoint')),
	RenewEndpoint = new (require('./RenewEndpoint')),
	SummaryCombinedEndpoint = new (require('./SummaryCombinedEndpoint')),
	SummaryRankedEndpoint = new (require('./SummaryRankedEndpoint')),
	SummaryNormalEndpoint = new (require('./SummaryNormalEndpoint')),
	ChampionsEndpoint = new (require('./ChampionsEndpoint'))

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

	SummaryCombined(region, userName) {
		return new Promise((resolve, reject) => {
			SummaryCombinedEndpoint.Request({region, userName})
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

	SummaryRanked(region, userName) {
		return new Promise((resolve, reject) => {
			this.SummaryCombined(region, userName)
				.then((response) => {
					if ('summonerId' in response) {
						SummaryRankedEndpoint.Request({region, summonerId: response.summonerId})
							.then((response1) => {
								if (response1 instanceof Error) {
									reject(response1)
								} else {
									response.games = response1
									resolve(response)
								}
							})
							.catch((error) => {
								reject(error)
							})
					} else {
						reject(new Error(errorMessages.EMPTY_RESPONSE, responseCodes.ERROR))
					}
				})
				.catch((error) => {
					reject(error)
				})
		})
	}

	SummaryNormal(region, userName) {
		return new Promise((resolve, reject) => {
			this.SummaryCombined(region, userName)
				.then((response) => {
					if ('summonerId' in response) {
						SummaryNormalEndpoint.Request({region, summonerId: response.summonerId})
							.then((response1) => {
								if (response1 instanceof Error) {
									reject(response1)
								} else {
									response.games = response1
									resolve(response)
								}
							})
							.catch((error) => {
								reject(error)
							})
					} else {
						reject(new Error(errorMessages.EMPTY_RESPONSE, responseCodes.ERROR))
					}
				})
				.catch((error) => {
					reject(error)
				})
		})
	}

	Champions(region, userName, season) {
		return new Promise((resolve, reject) => {
			this.SummaryCombined(region, userName)
				.then((response) => {
					if ('summonerId' in response) {
						ChampionsEndpoint.Request({region, season, summonerId: response.summonerId})
							.then((response1) => {
								if (response1 instanceof Error) {
									reject(response1)
								} else {
									resolve(response1)
								}
							})
							.catch((error) => {
								reject(error)
							})
					} else {
						reject(new Error(errorMessages.EMPTY_RESPONSE, responseCodes.ERROR))
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