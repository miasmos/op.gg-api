'use strict'
let request = require('request-promise'),
	Promise = require('bluebird'),
	cheerio = require('cheerio'),
	errors = require('./error.json'),
	riot = require('./riot')

class Parse {
	constructor() {
		this.validate = false
		this.apiList = {}
		this.baseURI = 'http://region.op.gg'
		this.headers = {
			'Content-Type': 'text/html',
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36',
			'Accept-Language': 'en-GB,en-US;q=0.8,en;q=0.6'
		}
	}

	Live(region, key) {
		if (!!key) this.__spawnAPI(key)
		return this.__complete(region, '/spectate/pro', ($) => {
			return new Promise((resolve, reject) => {
				if (!!key) {
					this.apiList[key].Champions()
						.then((champions) => {
							resolve(parse.call(this, $, champions))
						})
						.catch((error) => {
							reject(error)
						})
				} else {
					resolve(parse.call(this, $))
				}
			})
		})

		function parse($, champions) {
			var data = []
			$('div.SpectateSummonerList .Item').each((i,item) => {
				let $ = cheerio.load(item),
					summoner = {}
				summoner.timestamp = Number($('.GameTime ._timeago').attr('data-datetime'))
				summoner.gametype = this.__strip($('.GameType').text())

				summoner.champion = {
					name: this.__strip($('.ChampionName').text()),
					image: this.__strip($('.ChampionImage .Image').attr('src'))
				}
				if (!!champions) {
					let key = summoner.champion.name.replace(/\s/g, '')
					if (key in champions) {
						summoner.champion.id = champions[key].id
						summoner.champion.title = champions[key].title
					}
				}
				
				var matchIdRegex = new RegExp(/openSpectate\((\d*)\)/g)
				summoner.matchId = Number(matchIdRegex.exec($('.Actions a:first-child').attr('onclick'))[1])
				summoner.name = this.__strip($('.SummonerName').text())
				summoner.team = this.__strip($('.TeamName').text())
				var logo = this.__strip($('.TierMedal img').attr('src'))
				summoner.teamLogo = !!logo ? logo : undefined
				summoner.alias = this.__strip($('.Footer .Extra').text())
				data.push(summoner)
			})
			return data
		}
	}

	__spawnAPI(key) {
		if (!(key in this.apiList)) {
			this.apiList[key] = new riot({key: key})
		}
	}

	__complete(region, endpoint, filter) {
		return new Promise((resolve, reject) => {
			request(this.__options(region, endpoint))
				.then((html) => {
					var $ = cheerio.load(html)
					if (!$) throw new Error(errors.INVALID_HTML)

					if (typeof filter === 'function') {
						filter($)
							.then((data) => {
								if ((Array.isArray(data) && !data.length) || (!Array.isArray(data) && !Object.keys(data).length)) {
									reject(errors.EMPTY_RESPONSE)
								} else {
									resolve(data)
								}
							})
							.catch((error) => {
								throw new Error(error)
							})
					} else {
						resolve({})
					}
				})
				.catch((error) => {
					reject(error)
				})
		})
	}

	__options(region, endpoint, parseFn) {
		console.log(endpoint)
		return {
			headers: this.headers,
			uri: this.baseURI.replace('region', region) + endpoint,
			transform: !!parseFn && typeof parseFn === 'function' ? parseFn : undefined
		}
	}

	__strip(str) {return !!str ? str.replace(/\n|\r/g, '') : undefined}
}

module.exports = new Parse()