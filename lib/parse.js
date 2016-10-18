'use strict'
let request = require('request-promise'),
	Promise = require('bluebird'),
	cheerio = require('cheerio'),
	errors = require('./error.json'),
	championData = require('./champions.json');

class Parse {
	constructor(opts) {
		if (!opts) opts = {}
		this.validate = opts.validate ? opt.validate : false
		this.baseURI = 'http://region.op.gg'
		this.headers = {
			'Content-Type': 'text/html',
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36',
			'Accept-Language': 'en-GB,en-US;q=0.8,en;q=0.6'
		}
	}

	Live(region) {
		return this.__parse(region, '/spectate/pro', ($) => {
			var data = []

			$('div.SpectateSummonerList .Item').each((i,item) => {
				let $ = cheerio.load(item),
					summoner = {}

				summoner.timestamp = Number($('.GameTime ._timeago').attr('data-datetime'))
				summoner.gametype = this.__strip($('.GameType').text())
				var champName = this.__strip($('.ChampionName').text())
				summoner.champion = championData[champName.replace(/\s/g, '')]
				summoner.champion.image = this.__strip($('.ChampionImage .Image').attr('src'))
				delete(summoner.champion.key)
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
		})
	}

	__parse(region, endpoint, filter) {
		return new Promise((resolve, reject) => {
			request(this.__options(region, endpoint))
				.then((html) => {
					var $ = cheerio.load(html)
					if (!$) throw new Error(errors.INVALID_HTML)
					var data = typeof filter === 'function' ? filter($) : {}
					if ((Array.isArray(data) && !data.length) || (!Array.isArray(data) && !Object.keys(data).length)) throw new Error(errors.EMPTY_RESPONSE)
					resolve(data)
				})
				.catch((error) => {
					console.error(error)
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