'use strict'
var Endpoint = require('./Endpoint'),
	cheerio = require('cheerio')

module.exports = class AnalyticsEndpoint extends Endpoint {
	Path() {
		return '/champion/statistics'
	}

	Parse($) {
		var data = {},
			regex = new RegExp(/[0-9]*\.[0-9]*/g)

		regex = regex.exec($('.PageDescription .Small'))
		data.patch = regex.length ? parseFloat(regex[0]) : undefined
		data.winrate = {}
		$('.SideContent .ChampionRankingSummary:nth-child(1) .Item').each((i,item) => {
			let $ = cheerio.load(item),
				champions = [],
				lane = this.Strip($('.Title').text())

			$('.Champion').each((j,item1) => {
				let $ = cheerio.load(item1),
					champion = {}

				champion.place = j+1
				champion.name = this.Strip($('.Champion .Image').text()).replace(/[0-9]*\. /g, '')
				var regex = new RegExp(/([0-9]{1,2}\.[0-9]{2})/g)
				regex = regex.exec(this.Strip($('.Champion a').attr('title')))

				champion.percent = regex.length ? parseFloat(regex[1]) : undefined
				champions.push(champion)
			})

			data.winrate[lane.toLowerCase()] = champions
		})

		data.pickrate = {}
		$('.SideContent .ChampionRankingSummary:nth-child(2) .Item').each((i,item) => {
			let $ = cheerio.load(item),
				champions = [],
				lane = this.Strip($('.Title').text())

			$('.Champion').each((j,item1) => {
				let $ = cheerio.load(item1),
					champion = {}

				champion.place = j+1
				champion.name = this.Strip($('.Champion .Image').text()).replace(/[0-9]*\. /g, '')
				var regex = new RegExp(/([0-9]{1,2}\.[0-9]{2})/g)
				regex = regex.exec(this.Strip($('.Champion a').attr('title')))
				champion.percent = regex.length ? parseFloat(regex[1]) : undefined
				champions.push(champion)
			})

			data.pickrate[lane.toLowerCase()] = champions
		})

		data.banrate = []
		$('.SideContent .ChampionBanRateSummary .Content .Row').each((i,item) => {
			let $ = cheerio.load(item),
				champion = {}

			champion.place = i //first index is a heading
			champion.name = this.Strip($('.ChampionName').text())
			champion.percent = parseFloat($('.Percent').text().replace('%',''))
			if (!!champion.name) data.banrate.push(champion)
		})
		return data
	}
}