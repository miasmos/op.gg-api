'use strict'
var Endpoint = require('./Endpoint'),
	cheerio = require('cheerio')

module.exports = class AnalyticsByChampionItemsEndpoint extends Endpoint {
	Path() {
		return '/champion/:champion/statistics/:role/item'
	}

	Parse($) {
		var data = [],
			regex = undefined

		//parse overall items
		$('.RealContent .Box').eq(0).find('.Content .Row').each((i, element) => {
			if (i == 0) return
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

			data.push(item)
		})
		//end parse overall items

		return data
	}

	getItemID(str) {
		if (!str || typeof str !== 'string' || !str.length) return str
		var regex = new RegExp(/\/([0-9]*)\.png/g).exec(str)
		return !!regex && regex.length ? parseInt(regex[1]) : str
	}
}