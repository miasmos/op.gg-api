'use strict'
var Endpoint = require('./Endpoint'),
	cheerio = require('cheerio')

module.exports = class LiveEndpoint extends Endpoint {
	Path() {
		return '/spectate/pro'
	}

	Parse($) {
		var data = []
		$('div.SpectateSummonerList .Item').each((i,item) => {
			let $ = cheerio.load(item),
				summoner = {}
			summoner.timestamp = Number($('.GameTime ._timeago').attr('data-datetime'))
			summoner.gametype = this.Strip($('.GameType').text())

			summoner.champion = {
				name: this.Strip($('.ChampionName').text()),
				image: this.Strip($('.ChampionImage .Image').attr('src'))
			}

			var matchIdRegex = new RegExp(/openSpectate\((\d*)\)/g)
			summoner.matchId = Number(matchIdRegex.exec($('.Actions a:first-child').attr('onclick'))[1])
			summoner.name = this.Strip($('.SummonerName').text())
			summoner.team = this.Strip($('.TeamName').text())
			var logo = this.Strip($('.TierMedal img').attr('src'))
			summoner.teamLogo = !!logo ? logo : undefined
			summoner.alias = this.Strip($('.Footer .Extra').text())
			data.push(summoner)
		})
		return data
	}
}