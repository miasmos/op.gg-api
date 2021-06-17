'use strict'
var Endpoint = require('./Endpoint'),
	cheerio = require('cheerio'),
	Error = require('../Responses/Error'),
	responseCodes = require('../Responses/response_codes.json'),
	errorMessages = require('../Responses/error_messages.json')

module.exports = class LeaguesEndpoint extends Endpoint {
	Path() {
		return '/summoner/league/'
	}

	ErrorCheck($) {
		if (!$('.LeagueContent .Content .Row').length) {
			return new Error(errorMessages.NO_RESULTS, responseCodes.NO_RESULTS)
		}
		return false
	}

	Parse($) {
		var data = {}

		data.rank = this.Strip($('.LeagueTierRank').text())
		data.name = this.Strip($('.LeagueName').text())
		data.summoners = []

		$('.LeagueContent .Content .Row').each((index, item) => {
			var $ = cheerio.load(item),
				summoner = {}

			summoner.place = index+1
			summoner.image = $('.SummonerImage img').attr('src')
			summoner.name = this.Strip($('.SummonerName a').text())
			summoner.emblems = {}
			summoner.emblems.veteran = $('.Emblems .__spSite-111').length ? true : false
			summoner.emblems.hot = $('.Emblems .__spSite-107').length ? true : false
			summoner.emblems.recruit = $('.Emblems .__spSite-105').length ? true : false
			summoner.emblems.inactive = $('.Emblems .__spSite-108').length ? false : true
			summoner.wins = parseInt($('.WinRatioGraph .Text.Left').text())
			summoner.losses = parseInt($('.WinRatioGraph .Text.Right').text())
			summoner.winRatio = parseInt($('.WinRatioGraph .WinRatio').text())
			if ($('.LP.Cell').length) {
				summoner.lp = parseInt($('.LP').text())
			} else {
				summoner.lp = 100
			}
			if ($('.SummonerSeries').length) {
				var wins = 0, losses = 0
				$('.SummonerSeries .Item').each((index1, item1) => {
					var $ = cheerio.load(item1)
					if ($('.__spSite-138').length) {
						wins++
					} else if ($('.__spSite-136').length) {
						losses++
					}
				})
				summoner.series = {
					wins: wins,
					losses: losses
				}
			} else {
				summoner.series = {}
			}
			data.summoners.push(summoner)
		})
		return data
	}
}