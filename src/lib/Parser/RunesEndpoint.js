'use strict'
var Endpoint = require('./Endpoint'),
	cheerio = require('cheerio'),
	Error = require('../Responses/Error'),
	responseCodes = require('../Responses/response_codes.json'),
	errorMessages = require('../Responses/error_messages.json')

module.exports = class RunesEndpoint extends Endpoint {
	Path() {
		return '/summoner/rune/'
	}

	ErrorCheck($) {
		if (!$) return false
		if ($('.ErrorMessage').length) {
			return new Error(errorMessages.NO_RESULTS, responseCodes.NO_RESULTS)
		}
		return false
	}

	Parse($$) {
		var data = [],
			runeTypes = ['mark','seal','glyph','quintessence'],
			runeIndex = -1

		$$('.RunePageWrap').each((index, item) => {
			var $ = cheerio.load(item),
				runeContainer = {},
				runeType = {}

			runeContainer.title = this.Strip($$('.RunePageList .Button').eq(index).find('.PageName').text())

			$('.RunePageSummaryList .Title, .RunePageSummaryList .Item').each((index1, item1) => {
				var title = runeTypes[runeIndex]

				if (item1.attribs.class.indexOf('Title') > -1) {
					runeIndex++
					runeContainer[runeTypes[runeIndex]] = []
					return
				}

				var $ = cheerio.load(item1),
					rune = {}

				rune.image = this.Strip($('.Image img').attr('src'))
				rune.name = this.Strip($('.Image img').attr('alt'))
				rune.effect = this.Strip($('.Name').text())
				rune.count = parseInt($('.Count').text().replace('x',''))
				runeContainer[title].push(rune)
			})
			runeIndex = -1
			data.push(runeContainer)
		})

		var hasRunes = false
		for (var runes in data) {
			var rune = data[runes]
			if (rune.mark.length || rune.seal.length || rune.glyph.length || rune.quintessence.length) {
				hasRunes = true
				break
			}
		}
		return hasRunes ? data : new Error(errorMessages.NO_RESULTS, responseCodes.NO_RESULTS)
	}
}