'use strict'
var Endpoint = require('./Endpoint'),
	cheerio = require('cheerio'),
	Error = require('../Responses/Error'),
	responseCodes = require('../Responses/response_codes.json'),
	errorMessages = require('../Responses/error_messages.json')

module.exports = class ChampionsEndpoint extends Endpoint {
	Path() {
		return '/summoner/champions/ajax/champions.rank/'
	}

	ErrorCheck($) {
		if (!$) return false
		if ($('.ErrorMessage').length) {
			return new Error(errorMessages.NO_RESULTS, responseCodes.NO_RESULTS)
		}
		return false
	}

	Parse($) {
		var data = []
		$('.Body > .Row').each((index, item) => {
			var $ = cheerio.load(item),
				champ = {}

			champ.rank = index+1
			champ.name = this.Strip($('.ChampionName a').text())
			champ.wins = parseInt($('.RatioGraph .Graph .Text.Left').text().replace('W',''))
			champ.losses = parseInt($('.RatioGraph .Graph .Text.Right').text().replace('L',''))
			champ.winRatio = parseInt($('.RatioGraph .WinRatio').text().replace('%',''))
			champ.kills = parseFloat($('.KDA .Kill').text())
			champ.deaths = parseFloat($('.KDA .Death').text())
			champ.assists = parseFloat($('.KDA .Assist').text())
			champ.ratio = parseFloat($('td.KDA').attr('data-value'))
			champ.gold = parseInt($('.Value.Cell').eq(0).text().replace(',',''))
			champ.cs = parseFloat($('.Value.Cell').eq(1).text())
			champ.turrets = parseFloat($('.Value.Cell').eq(2).text())
			champ.maxKills = parseInt($('.Value.Cell').eq(3).text())
			champ.maxDeaths = parseInt($('.Value.Cell').eq(4).text())
			champ.damageDealt = parseInt($('.Value.Cell').eq(5).text().replace(',',''))
			champ.damageTaken = parseInt($('.Value.Cell').eq(6).text().replace(',',''))
			var temp = parseInt($('.Value.Cell').eq(7).text())
			champ.doubleKill = isNaN(temp) ? 0 : temp
			temp = parseInt($('.Value.Cell').eq(8).text())
			champ.tripleKill = isNaN(temp) ? 0 : temp
			temp = parseInt($('.Value.Cell').eq(9).text())
			champ.quadraKill = isNaN(temp) ? 0 : temp
			data.push(champ)
		})
		return data
	}
}