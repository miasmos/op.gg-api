'use strict'
var Endpoint = require('./Endpoint'),
	cheerio = require('cheerio')

module.exports = class AnalyticsByChampionEndpoint extends Endpoint {
	Path() {
		return '/champion/:champion/statistics/:role'
	}

	Parse($) {
		var data = {},
			regex = undefined,
			rowStart = 2

		//parse generic data
		data.patch = $('.PageDescription .Small').text()
		regex = new RegExp(/[0-9]{1,2}\.[0-9]{2}$/g).exec(data.patch)
		data.patch = !!regex && regex.length ? parseFloat(regex[0]) : undefined

		var temp = $('.ChampionInfo .ChampionStats').text()
		regex = new RegExp(/Ranking ([0-9]{0,4})/g).exec(temp)
		data.banrateRank = !!regex && regex.length ? parseInt(regex[1]) : undefined
		regex = new RegExp(/\(([0-9]{0,3}\.[0-9]{1,2})%/g).exec(temp)
		data.banrate = !!regex && regex.length ? parseFloat(regex[1]) : undefined
		//end parse generic data

		//parse roles
		data.roles = []
		$('.ChampionRoleList .Item').each((i, item) => {
			var $ = cheerio.load(item),
				role = {}

			role.role = this.Strip($('.Role .Label').text()).toLowerCase()
			role.rolePercent = parseFloat($('.Value').text())
			role.winrateRank = $('.Stats').eq(0).find('.Value').attr('title')
			regex = new RegExp(/^[0-9]{0,4}/g).exec(role.winrateRank)
			role.winrateRank = !!regex && regex.length ? parseInt(regex[0]) : undefined
			role.winrate = parseFloat($('.Stats').eq(0).find('small').text())
			role.pickrateRank = $('.Stats').eq(1).find('.Value').attr('title')
			regex = new RegExp(/^[0-9]{0,4}/g).exec(role.pickrateRank)
			role.pickrateRank = !!regex && regex.length ? parseInt(regex[0]) : undefined
			role.pickrate = parseFloat($('.Stats').eq(1).find('small').text())
			role.position = i+1
			data.roles.push(role)
		})
		//end parse roles

		//parse skills
		data.skills = {}
		data.skills.order = []
		$('.ChampionStatsSummaryTable .Row:nth-child(1) .Item').each((key, item) => {
			var $ = cheerio.load(item),
				skill = {}

			skill.place = key+1
			skill.button = this.Strip($('.ExtraString').text())
			data.skills.order.push(skill)
		})
		data.skills.pickrate = parseFloat($('.ChampionStatsSummaryTable .Row:nth-child(1) .PickRate').text().replace('Pick Rate', ''))
		data.skills.pickrateSample = parseInt($('.ChampionStatsSummaryTable .Row:nth-child(1) .PickRate span').text().replace(',',''))
		data.skills.winrate = parseFloat($('.ChampionStatsSummaryTable .Row:nth-child(1) .WinRate').text().replace('Win Rate',''))
		//end parse skills

		//parse spells
		data.spells = []
		var rowCount = parseInt($('.ChampionStatsSummaryTable .Row:nth-child(2) .Label').attr('rowspan'))
		for (var i = rowStart; i < rowStart+rowCount; i++) {
			var element = $('.ChampionStatsSummaryTable .Row').eq(i),
				spellContainer = {},
				spell = {}

			spellContainer.pickrate = parseFloat(element.find('.PickRate').text())
			spellContainer.pickrateSample = parseInt(element.find('.PickRate span').text().replace(',',''))
			spellContainer.winrate = parseFloat(element.find('.WinRate').text())
			spellContainer.spells = []

			element.find('.ListCell .Item').each((j, element1) => {
				var $ = cheerio.load(element1)
				spell = {}
				spell.image = this.Strip($('img').attr('src'))
				var title = $('img').attr('title')
				regex = new RegExp(/>([a-zA-Z]{1,})</g).exec(title)
				spell.name = !!regex && regex.length ? regex[1] : undefined
				spellContainer.spells.push(spell)
			})

			data.spells.push(spellContainer)
		}

		rowStart += rowCount
		//end parse spells

		//parse starter items
		data.starterItems = []
		rowCount = parseInt($(`.ChampionStatsSummaryTable .Row:nth-child(${rowStart}) .Label`).attr('rowspan'))
		for (var i = rowStart; i < rowStart+rowCount; i++) {
			var element = $('.ChampionStatsSummaryTable .Row').eq(i),
				itemContainer = {},
				item = {}

			itemContainer.pickrate = parseFloat(element.find('.PickRate').text())
			itemContainer.pickrateSample = parseInt(element.find('.PickRate span').text().replace(',',''))
			itemContainer.winrate = parseFloat(element.find('.WinRate').text())
			itemContainer.items = []

			element.find('.ListCell .Item').each((j, element1) => {
				var $ = cheerio.load(element1)
				item = {}
				item.image = this.Strip($('img').attr('src'))
				item.name = this.Strip($('img').attr('alt'))
				item.id = this.getItemID(item.image)
				itemContainer.items.push(item)
			})

			data.starterItems.push(itemContainer)
		}

		rowStart += rowCount
		//end parse starter items

		//parse core build
		data.coreItems = []
		rowCount = parseInt($(`.ChampionStatsSummaryTable .Row:nth-child(${rowStart}) .Label`).attr('rowspan'))
		for (var i = rowStart; i < rowStart+rowCount; i++) {
			var element = $('.ChampionStatsSummaryTable .Row').eq(i),
				itemContainer = {},
				item = {}

			itemContainer.pickrate = parseFloat(element.find('.PickRate').text())
			itemContainer.pickrateSample = parseInt(element.find('.PickRate span').text().replace(',',''))
			itemContainer.winrate = parseFloat(element.find('.WinRate').text())
			itemContainer.items = []

			element.find('.ListCell .Item').each((j, element1) => {
				var $ = cheerio.load(element1)
				item = {}
				item.image = this.Strip($('img').attr('src'))
				item.name = this.Strip($('img').attr('alt'))
				item.id = this.getItemID(item.image)
				itemContainer.items.push(item)
			})

			data.coreItems.push(itemContainer)
		}

		rowStart += rowCount
		//end parse core build

		//parse boots
		data.boots = []
		rowCount = parseInt($(`.ChampionStatsSummaryTable .Row:nth-child(${rowStart}) .Label`).attr('rowspan'))
		for (var i = rowStart; i < rowStart+rowCount; i++) {
			var element = $('.ChampionStatsSummaryTable .Row').eq(i),
				item = {}

			item.pickrate = parseFloat(element.find('.PickRate').text())
			item.pickrateSample = parseInt(element.find('.PickRate span').text().replace(',',''))
			item.winrate = parseFloat(element.find('.WinRate').text())

			element.find('.Cell.Single').each((j, element1) => {
				if (j > 0) return
				var $ = cheerio.load(element1)
				item.image = this.Strip($('img').attr('src'))
				item.name = this.Strip($('img').attr('alt'))
				item.id = this.getItemID(item.image)
			})

			data.boots.push(item)
		}

		rowStart += rowCount
		//end parse boots

		//parse keystones
		data.keystones = []
		rowCount = parseInt($(`.ChampionStatsSummaryTable .Row:nth-child(${rowStart}) .Label`).attr('rowspan'))
		for (var i = rowStart; i < rowStart+rowCount; i++) {
			var element = $('.ChampionStatsSummaryTable .Row').eq(i),
				item = {}

			item.pickrate = parseFloat(element.find('.PickRate').text())
			item.pickrateSample = parseInt(element.find('.PickRate span').text().replace(',',''))
			item.winrate = parseFloat(element.find('.WinRate').text())

			element.find('.Cell.Single').each((j, element1) => {
				if (j > 0) return
				var $ = cheerio.load(element1)
				item.image = this.Strip($('img').attr('src'))
				item.name = this.Strip($('img').attr('alt'))
				item.id = this.getItemID(item.image)
			})

			data.keystones.push(item)
		}

		rowStart += rowCount
		//end parse keystones

		//parse masteries
		data.masteries = []
		rowCount = parseInt($(`.ChampionStatsSummaryTable .Row:nth-child(${rowStart}) .Label`).attr('rowspan'))
		for (var i = rowStart; i < rowStart+rowCount; i++) {
			var element = $('.ChampionStatsSummaryTable .Row').eq(i),
				masteryContainer = {},
				mastery = {}

			masteryContainer.masteries = {}
			mastery.ranks = []
			element.find('.MasteryPageArea').each((i, item) => {
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

			masteryContainer.pickrate = parseFloat(element.find('.PickRate').text())
			masteryContainer.pickrateSample = parseInt(element.find('.PickRate span').text().replace(',',''))
			masteryContainer.winrate = parseFloat(element.find('.WinRate').text())

			data.masteries.push(masteryContainer)
		}

		rowStart += rowCount
		//end parse masteries

		//parse runes
		data.runes = []
		rowCount = parseInt($(`.ChampionStatsSummaryTable .Row:nth-child(${rowStart}) .Label`).attr('rowspan'))
		for (var i = rowStart; i < rowStart+rowCount; i++) {
			var element = $('.ChampionStatsSummaryTable .Row').eq(i),
				runesContainer = {},
				rune = {}

			runesContainer.pickrate = parseFloat(element.find('.PickRate').text())
			runesContainer.pickrateSample = parseInt(element.find('.PickRate span').text().replace(',',''))
			runesContainer.winrate = parseFloat(element.find('.WinRate').text())
			runesContainer.items = []

			element.find('.RuneItemList .Item').each((j, element1) => {
				var $ = cheerio.load(element1)
				rune = {}
				rune.image = this.Strip($('img').attr('src'))
				rune.type = this.Strip($('.Label').text())
				rune.count = parseInt($('.Value').text().replace('x',''))
				runesContainer.items.push(rune)
			})

			data.runes.push(runesContainer)
		}

		rowStart += rowCount
		//end parse runes

		//parse graph data
		data.charts = {}
		var graphtypes = ['WinRate', 'PickRate', 'GameLengthWinRate']
		for (var index in graphtypes) {
			var graphtype = graphtypes[index],
				regex = undefined,
				chart = {}

			switch(graphtype) {	//the below regex is invalid when inserting a variable for some reason, let's just do it the long way
				case 'WinRate':
					regex = new RegExp(/GenerateGraph\('WinRateGraph',\s*\d*,\s*\d*,\s?\[.*?\],(.*?])/g).exec($.html())
					break;
				case 'PickRate':
					regex = new RegExp(/GenerateGraph\('PickRateGraph',\s*\d*,\s*\d*,\s?\[.*?\],(.*?])/g).exec($.html())
					break;
				case 'GameLengthWinRate':
					 regex = new RegExp(/GenerateGraph\('GameLengthWinRateGraph',\s*\d*,\s*\d*,\s?\[.*?\],(.*?])/g).exec($.html())
					 break;
			}

			if (!!regex && regex.length) {
				var data1 = "{\"data\":" + regex[1] + "}"

				try {
					data1 = JSON.parse(data1).data

					for (var item in data1) {
						data1[item].winrate = data1[item].y
						delete data1[item]['y']

						data1[item].patch = parseFloat(data1[item].patchIndex) ? parseFloat(data1[item].patchIndex) : undefined
						delete data1[item]['patchIndex']

						data1[item].date = data1[item].patchDate ? data1[item].patchDate : undefined
						delete data1[item]['patchDate']

						data1[item].rank = parseInt(data1[item].rank.slice(0,data1[item].rank.length-2))
					}
					data.charts[graphtype.toLowerCase()] = data1
				} catch(e) {
					console.log(`${graphtype} graph parse failed`, e)
				}
			} else {
				data.charts[graphtype.toLowerCase()] = undefined
			}
		}
		//end parse graph data
		return data
	}

	getItemID(str) {
		if (!str || typeof str !== 'string' || !str.length) return str
		var regex = new RegExp(/\/([0-9]*)\.png/g).exec(str)
		return !!regex && regex.length ? parseInt(regex[1]) : str
	}
}