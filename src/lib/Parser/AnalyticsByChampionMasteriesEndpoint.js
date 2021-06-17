'use strict'
var Endpoint = require('./Endpoint'),
	cheerio = require('cheerio')

module.exports = class AnalyticsByChampionMasteriesEndpoint extends Endpoint {
	Path() {
		return '/champion/:champion/statistics/:role/mastery'
	}

	Parse($) {
		var data = {},
			regex = undefined

		data.masteries = []
		//parse masteries
		$('.ChampionStatsDetailTable .Content').eq(0).find('.Row').each((i, element) => {
			var $ = cheerio.load(element),
				masteryContainer = {},
				mastery = {}

			masteryContainer.masteries = {}
			mastery.ranks = []
			$('.MasteryPageArea').each((i, item) => {
				var $ = cheerio.load(item)

				$('.Mastery').each((j, item1) => {
					var $ = cheerio.load(item1),
						rank1 = $('.Rank'),
						rank2 = item1.attribs.class.indexOf('Rank-full') > -1,
						obj = {}

					obj.rank = rank1.length ? parseInt(rank1.text()) : rank2 ? 1 : 0
					obj.name = this.Strip($('.Image').text())
					obj.position = j+1
					mastery.ranks.push(obj)
				})

				mastery.total = $('.Summary')
				regex = new RegExp(/: ([0-9]{1,2})/g).exec(mastery.total)
				mastery.total = !!regex && regex.length ? parseInt(regex[1]) : undefined
				var title = ['offense', 'defense', 'utility'][i]
				masteryContainer.masteries[title] = mastery
				mastery = {}
				mastery.ranks = []
			})

			masteryContainer.pickrate = parseFloat($('.PickRate').text())
			masteryContainer.pickrateSample = parseInt($('.PickRate span').text().replace(',',''))
			masteryContainer.winrate = parseFloat($('.WinRate').text())

			data.masteries.push(masteryContainer)
		})
		//end parse masteries

		//parse keystones
		data.keystones = []
		$('.ChampionStatsDetailTable .Content').eq(1).find('.Row').each((i, element) => {
			var $ = cheerio.load(element),
				item = {}

			item.pickrate = parseFloat($('.PickRate').text())
			item.pickrateSample = parseInt($('.PickRate span').text().replace(',',''))
			item.winrate = parseFloat($('.WinRate').text())

			$('.Cell.Single').each((j, element1) => {
				if (j > 0) return
				var $ = cheerio.load(element1)
				item.image = this.Strip($('img').attr('src'))
				item.name = this.Strip($('img').attr('alt'))
				item.id = this.getItemID(item.image)
			})

			data.keystones.push(item)
		})
		//end parse keystones

		return data
	}

	getItemID(str) {
		if (!str || typeof str !== 'string' || !str.length) return str
		var regex = new RegExp(/\/([0-9]*)\.png/g).exec(str)
		return !!regex && regex.length ? parseInt(regex[1]) : str
	}
}