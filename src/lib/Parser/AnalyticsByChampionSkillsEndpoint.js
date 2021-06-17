'use strict'
var Endpoint = require('./Endpoint'),
	cheerio = require('cheerio')

module.exports = class AnalyticsByChampionSkillsEndpoint extends Endpoint {
	Path() {
		return '/champion/:champion/statistics/:role/skill'
	}

	Parse($) {
		var data = [],
			skillsContainer = {},
			buttons = ['q','w','e','r'],
			temp = {}

		skillsContainer.order = []
		$('.ChampionStatsDetailTable tbody.Content .Row').each((i, element) => {
			var $ = cheerio.load(element),
				obj = {}
			skillsContainer = {}
			temp = {}

			var test = false
			$('.SkillBuildTable .Row').each((j, element1) => {
				test = true
				var $ = cheerio.load(element1),
					button = buttons[j]
				temp[button] = []

				$('.Value').each((k, element2) => {
					temp[button].push(element2.attribs.class.indexOf('LevelUP') > -1)
				})
			})
			if (!test) return

			var temp1 = []
			for (var i = 0; i < 16; i++) { //normalize skillup data
				for (var index in buttons) {
					var button = buttons[index]
					if (temp[button][i]) {
						temp1.push(button)
						break
					}
					if (index > buttons.length-1) {
						temp1.push(null)
					}
				}
			}
			skillsContainer.order = temp1

			skillsContainer.pickrate = parseFloat($('.PickRate').text().replace('Pick Rate', ''))
			skillsContainer.pickrateSample = parseInt($('.PickRate span').text().replace(',',''))
			skillsContainer.winrate = parseFloat($('.WinRate').text().replace('Win Rate',''))

			data.push(skillsContainer)
		})

		return data
	}
}