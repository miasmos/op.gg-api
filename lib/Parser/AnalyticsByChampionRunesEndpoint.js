'use strict'
var Endpoint = require('./Endpoint'),
	cheerio = require('cheerio')

module.exports = class AnalyticsByChampionRunesEndpoint extends Endpoint {
	Path() {
		return '/champion/:champion/statistics/:role/rune'
	}

	Parse($) {
		var data = []

		$('.ChampionStatsDetailTable .Content .Row').each((i, element) => {
			var $ = cheerio.load(element)
			var runesContainer = {}

			runesContainer.pickrate = parseFloat($('.PickRate').text())
			runesContainer.pickrateSample = parseInt($('.PickRate span').text().replace(',',''))
			runesContainer.winrate = parseFloat($('.WinRate').text())
			runesContainer.items = []

			$('.RuneItemList .Item').each((j, element1) => {
				var $ = cheerio.load(element1),
					rune = {}
				rune.image = this.Strip($('img').attr('src'))
				rune.type = this.Strip($('.Label').text())
				rune.count = parseInt($('.Value').text().replace('x',''))
				runesContainer.items.push(rune)
			})

			data.push(runesContainer)
		})

		return data
	}
}