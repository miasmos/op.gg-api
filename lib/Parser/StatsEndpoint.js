'use strict'
var Endpoint = require('./Endpoint'),
	cheerio = require('cheerio'),
	Error = require('../Responses/Error'),
	responseCodes = require('../Responses/response_codes.json'),
	errorMessages = require('../Responses/error_messages.json')

module.exports = class ChampionsEndpoint extends Endpoint {
	Path() {
		return '/statistics/ajax2/champion/'
	}

	Params() {
		return {
			type: 'win',
			league: 'all',
			period: 'month',
			mapId: 1,
			queue: 'ranked'
		}
	}

	ErrorCheck($) {
		if ($.html().indexOf('The specified data does not exist.') > -1) return new Error(errorMessages.NO_RESULTS, responseCodes.NO_RESULTS)
		return false
	}

	Parse($) {
		var data = []
		$('.Content .Row').each((index, item) => {
			var $ = cheerio.load(item),
				champ = {}

			champ.rank = index+1
			champ.name = this.Strip($('.ChampionName a').text())
			champ.image = $('.ChampionImage .Image').css('backgroundImage')
			champ.winrate = parseFloat($('td:nth-child(4)').find('.Value').text().replace(',',''))
			champ.games = parseInt($('td:nth-child(5)').text().replace(',',''))
			champ.kda = parseFloat($('.KDARatio .Ratio').text().replace(':1',''))
			champ.cs = parseFloat($('td:nth-child(7)').find('.Value').text())
			champ.gold = parseInt($('td:nth-child(8)').find('.Value').text().replace(',',''))
			data.push(champ)
		})
		return data
	}
}