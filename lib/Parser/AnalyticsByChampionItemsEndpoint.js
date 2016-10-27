'use strict'
var Endpoint = require('./Endpoint'),
	cheerio = require('cheerio')

module.exports = class AnalyticsByChampionItemsEndpoint extends Endpoint {
	Path() {
		return '/champion/:champion/statistics/:role/item'
	}

	Parse($) {
		var data = {},
			regex = undefined

		//parse core build
		data.coreItems = []
		$('.SideContent .Box').eq(0).find('.Content .Row').each((i, element) => {
			if (i == 0) return
			var $ = cheerio.load(element),
				buildContainer = {}

			buildContainer.pickrate = parseFloat($('.PickRate').text())
			buildContainer.pickrateSample = parseInt($('.PickRate span').text().replace(',',''))
			buildContainer.winrate = parseFloat($('.WinRate').text())
			buildContainer.items = []

			$('.ListCell .Item').each((j, element1) => {
				var $ = cheerio.load(element1),
					item = {}
				item.image = this.Strip($('img').attr('src'))
				item.name = this.Strip($('img').attr('alt'))
				item.id = this.getItemID(item.image)
				buildContainer.items.push(item)
			})

			data.coreItems.push(buildContainer)
		})
		//end parse core build

		//parse boots
		data.boots = []
		$('.SideContent .Box').eq(1).find('.Content .Row').each((i, element) => {
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

			data.boots.push(item)
		})
		//end parse boots

		//parse starter items
		data.starterItems = []
		$('.SideContent .Box').eq(2).find('.Content .Row').each((i, element) => {
			if (i == 0) return
			var $ = cheerio.load(element),
				itemContainer = {}

			itemContainer.pickrate = parseFloat($('.PickRate').text())
			itemContainer.pickrateSample = parseInt($('.PickRate span').text().replace(',',''))
			itemContainer.winrate = parseFloat($('.WinRate').text())
			itemContainer.items = []

			$('.ListCell .Item').each((j, element1) => {
				var $ = cheerio.load(element1),
					item = {}
				item.image = this.Strip($('img').attr('src'))
				item.name = this.Strip($('img').attr('alt'))
				item.id = this.getItemID(item.image)
				itemContainer.items.push(item)
			})

			data.starterItems.push(itemContainer)
		})
		//end parse starter items

		//parse overall items
		data.items = []
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

			data.items.push(item)
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