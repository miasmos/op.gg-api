'use strict'
var Endpoint = require('./Endpoint'),
	cheerio = require('cheerio')

module.exports = class AnalyticsByChampionEndpoint extends Endpoint {
	Path() {
		return '/champion/:championName/statistics/:role'
	}

	Parse($) {
		var data = {}

		data.skills = {}
		data.skills.order = []
		$('.ChampionStatsSummaryTable .Row:nth-child(1) .Item').each((key, item) => {
			var $ = cheerio.load(item),
				skill = {}

			skill.place = key+1
			skill.button = this.Strip($('.ExtraString').text())
			data.skills.order.push(skill)
		})
		data.skills.pickRate = parseFloat($('.ChampionStatsSummaryTable .Row:nth-child(1) .PickRate').text().replace('Pick Rate', ''))
		data.skills.pickRateSample = parseInt($('.ChampionStatsSummaryTable .Row:nth-child(1) .PickRate span').text().replace(',',''))
		data.skills.winRate = parseFloat($('.ChampionStatsSummaryTable .Row:nth-child(1) .WinRate').text().replace('Win Rate',''))
		return data
	}
}