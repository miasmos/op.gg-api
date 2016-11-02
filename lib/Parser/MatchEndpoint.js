'use strict'
var Endpoint = require('./Endpoint'),
	cheerio = require('cheerio'),
	Error = require('../Responses/Error'),
	errorMessages = require('../Responses/error_messages.json'),
	responseCodes = require('../Responses/response_codes.json')

module.exports = class MatchEndpoint extends Endpoint {
	Path() {
		return '/summoner/matches/ajax/detail/'
	}

	Parse($, json) {
		var data = {},
			team = {},
			player = {}

		$('.GameDetailTable').each((key0, value0) => {
			var $ = cheerio.load(value0)
			team = {}
			team.players = []

			$('.Content > .Row').each((key, value) => {
				var $ = cheerio.load(value)
				player = {}
				player.champion = this.Strip($('.ChampionImage .Image').text())
				player.level = parseInt($('.ChampionImage .Level').text())

				player.spells = {}
				var regex = />(.*)<\/b>/g.exec($('.SummonerSpell img').eq(0).attr('title'))
				if (!!regex && regex.length) player.spells.spell1Name = regex[1]
				player.spells.spell1Image = $('.SummonerSpell img').eq(0).attr('src')
				regex = />(.*)<\/b>/g.exec($('.SummonerSpell img').eq(1).attr('title'))
				if (!!regex && regex.length) player.spells.spell2Name = regex[1]
				player.spells.spell2Image = $('.SummonerSpell img').eq(1).attr('src')

				player.keystone = {}
				var regex = />(.*)<\/b>/g.exec($('.KeystoneMastery .Image').attr('title'))
				if (!!regex && regex.length) player.keystone.name = regex[1]
				player.keystone.image = $('.KeystoneMastery .Image').attr('src')
				player.keystone.id = this.getItemID(player.keystone.image)

				player.name = $('.SummonerName a').text()
				player.items = []

				$('.Items .Item').each((key1, value1) => {
					var $ = cheerio.load(value1),
						item = {},
						element = $('img')

					item.name = element.attr('alt')
					item.image = element.attr('src')
					item.id = this.getItemID(item.image)
					player.items.push(item)
				})

				player.ratio = parseFloat($('.KDARatio').text().replace(':1',''))
				player.kills = parseFloat($('.KDA .Kill').text())
				player.deaths = parseFloat($('.KDA .Death').text())
				player.assists = parseFloat($('.KDA .Assist').text())
				player.killParticipation = parseFloat($('.CKRate').text().replace('(','').replace('%)',''))
				player.damage = parseInt($('.Damage .ChampionDamage').text().replace(',',''))
				player.pinkWards = parseInt($('.VisionWard').text())
				player.wards = parseInt($('.Ward .Stats span').eq(0).text())
				player.wardsDestroyed = parseInt($('.Ward .Stats span').eq(1).text())
				player.cs = parseInt($('.CS .CS').text())
				player.cspm = parseFloat($('.CS .CSPerMinute').text().replace('/m',''))
				player.gold = parseFloat($('.Gold').text().replace('k',''))
				player.tier = this.Strip($('.Tier').text())
				var regex = parseInt(/[0-9]+/g.exec($('.Tier').attr('title')))
				player.lp = !!regex && regex.length ? regex[0] : undefined

				team.players.push(player)
			})

			team.result = $('.HeaderCell').eq(0).find('.GameResult').text().indexOf('Victory') > -1 ? 'Victory' : 'Defeat'
			team.color = $('.Header .HeaderCell').eq(0).text().indexOf('Blue') > -1 ? 'Blue' : 'Red'

			if ('team1' in data) data.team2 = team
			else data.team1 = team
		})

		if ('team1' in data) {
			var team1 = $('.Summary .Team-100')
			data.team1.kills = parseFloat(team1.find('.Kill').text())
			data.team1.deaths = parseInt(team1.find('.Death').text())
			data.team1.assists = parseInt(team1.find('.Assist').text())
			data.team1.barons = parseInt(team1.find('.Team .ObjectScore').eq(0).text())
			data.team1.dragons = parseInt(team1.find('.Team .ObjectScore').eq(1).text())
			data.team1.towers = parseInt(team1.find('.Team .ObjectScore').eq(2).text())
		}

		if ('team2' in data) {
			var team2 = $('.Summary .Team-200')
			data.team2.kills = parseFloat(team2.find('.Kill').text())
			data.team2.deaths = parseInt(team2.find('.Death').text())
			data.team2.assists = parseInt(team2.find('.Assist').text())
			data.team2.barons = parseInt(team2.find('.Team .ObjectScore').eq(0).text())
			data.team2.dragons = parseInt(team2.find('.Team .ObjectScore').eq(1).text())
			data.team2.towers = parseInt(team2.find('.Team .ObjectScore').eq(2).text())
		}

		  return data
	}

	getItemID(str) {
		if (!str || typeof str !== 'string' || !str.length) return str
		var regex = new RegExp(/\/([0-9]*)\.png/g).exec(str)
		return !!regex && regex.length ? parseInt(regex[1]) : str
	}
}