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
	ChampionsEndpoint = new (require('./ChampionsEndpoint')),
	LeaguesEndpoint = new (require('./LeaguesEndpoint')),
	MatchesEndpoint = new (require('./MatchesEndpoint')),
	MatchEndpoint = new (require('./MatchEndpoint')),
	RunesEndpoint = new (require('./RunesEndpoint')),
	MasteriesEndpoint = new (require('./MasteriesEndpoint')),
	MatchesByTimestampEndpoint = new (require('./MatchesByTimestampEndpoint')),
	StatsEndpoint = new (require('./StatsEndpoint')),
	AnalyticsEndpoint = new (require('./AnalyticsEndpoint')),
	AnalyticsByChampionEndpoint = new (require('./AnalyticsByChampionEndpoint')),
	AnalyticsByChampionItemsEndpoint = new (require('./AnalyticsByChampionItemsEndpoint')),
	AnalyticsByChampionSkillsEndpoint = new (require('./AnalyticsByChampionSkillsEndpoint')),
	AnalyticsByChampionRunesEndpoint = new (require('./AnalyticsByChampionRunesEndpoint')),
	AnalyticsByChampionMasteriesEndpoint = new (require('./AnalyticsByChampionMasteriesEndpoint'))

class Parser {
	constructor() {
		this.apiList = {}
		this.summonerIds = {}
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
						this.SaveId(region, userName, response.summonerId)
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
									this.SaveId(region, userName, response.summonerId)
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
									this.SaveId(region, userName, response.summonerId)
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
			if (this.GetId(region, userName)) {
				ChampionsEndpoint.Request({region, season, summonerId: this.GetId(region, userName)})
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
				this.SummaryCombined(region, userName)
					.then((response) => {
						if ('summonerId' in response) {
							ChampionsEndpoint.Request({region, season, summonerId: response.summonerId})
								.then((response1) => {
									if (response1 instanceof Error) {
										reject(response1)
									} else {
										this.SaveId(region, userName, response.summonerId)
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
			}
		})
	}

	Match(region, userName, gameId) {
		return new Promise((resolve, reject) => {
			if (this.GetId(region, userName)) {
				MatchEndpoint.Request({region, gameId, summonerId: this.GetId(region, userName)})
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
				this.SummaryCombined(region, userName)
					.then((response) => {
						if ('summonerId' in response) {
							MatchEndpoint.Request({region, gameId, summonerId: response.summonerId})
								.then((response1) => {
									if (response1 instanceof Error) {
										reject(response1)
									} else {
										this.SaveId(region, userName, response.summonerId)
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
			}
		})
	}

	League(region, userName) {
		return new Promise((resolve, reject) => {
			LeaguesEndpoint.Request({region, userName})
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

	Matches(region, userName) {
		return new Promise((resolve, reject) => {
			MatchesEndpoint.Request({region, userName})
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

	Runes(region, userName) {
		return new Promise((resolve, reject) => {
			RunesEndpoint.Request({region, userName})
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

	Masteries(region, userName) {
		return new Promise((resolve, reject) => {
			MasteriesEndpoint.Request({region, userName})
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

	MatchesByTimestamp(region, userName, startInfo) {
		return new Promise((resolve, reject) => {
			if (this.GetId(region, userName)) {
				MatchesByTimestampEndpoint.Request({region, startInfo, summonerId: this.GetId(region, userName)})
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
				this.SummaryCombined(region, userName)
					.then((response) => {
						if ('summonerId' in response) {
							MatchesByTimestampEndpoint.Request({region, startInfo, summonerId: response.summonerId})
								.then((response1) => {
									if (response1 instanceof Error) {
										reject(response1)
									} else {
										this.SaveId(region, userName, response.summonerId)
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
			}
		})
	}

	Stats(region, type, league, period, mapId, queue) {
		return new Promise((resolve, reject) => {
			StatsEndpoint.Request({region, type, league, period, mapId, queue})
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

	Analytics(region) {
		return new Promise((resolve, reject) => {
			AnalyticsEndpoint.Request({region})
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

	AnalyticsByChampion(region, champion, role) {
		return new Promise((resolve, reject) => {
			AnalyticsByChampionEndpoint.Request({region, champion, role})
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

	AnalyticsByChampionItems(region, champion, role) {
		return new Promise((resolve, reject) => {
			AnalyticsByChampionItemsEndpoint.Request({region, champion, role})
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

	AnalyticsByChampionSkills(region, champion, role) {
		return new Promise((resolve, reject) => {
			AnalyticsByChampionSkillsEndpoint.Request({region, champion, role})
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

	AnalyticsByChampionRunes(region, champion, role) {
		return new Promise((resolve, reject) => {
			AnalyticsByChampionRunesEndpoint.Request({region, champion, role})
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

	AnalyticsByChampionMasteries(region, champion, role) {
		return new Promise((resolve, reject) => {
			AnalyticsByChampionMasteriesEndpoint.Request({region, champion, role})
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

	SaveId(region, userName, summonerId) {
		if (!region || !userName || !summonerId) return
		if (!(region in this.summonerIds)) this.summonerIds[region] = {}
		this.summonerIds[region][userName] = summonerId
	}

	GetId(region, userName) {
		if (!(region in this.summonerIds) || !(userName in this.summonerIds[region])) return false
		return this.summonerIds[region][userName]
	}
}

module.exports = new Parser()