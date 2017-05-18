'use strict'
var Endpoint = require('./Endpoint'),
	cheerio = require('cheerio'),
	Error = require('../Responses/Error'),
	errorMessages = require('../Responses/error_messages.json'),
	responseCodes = require('../Responses/response_codes.json')

module.exports = class SummaryCombinedEndpoint extends Endpoint {
	Path() {
		return '/summoner/'
	}

	Parse($, json) {
		var data = {},
			recent = {}

		data.summonerId = $('#SummonerRefreshButton').attr('onclick')
		var regex = new RegExp(/this, '(\d*)'\)/g)
		regex = regex.exec(data.summonerId)
		data.summonerId = !!regex && regex.length ? parseInt(regex[1]) : undefined

		data.league = this.Strip($('.TierRankInfo .tierRank').text())
		data.leagueName = this.Strip($('.TierRankInfo .LeagueName').text())
		data.lp = parseInt($('.TierRankInfo .LeaguePoints').text().replace(' LP',''))
		if (!data.lp) data.lp = undefined
		data.wins = parseInt($('.WinRatioTitle .win').text().replace('W',''))
		if (!data.wins) data.wins = undefined
		data.losses = parseInt($('.WinRatioTitle .lose').text().replace('L',''))
		if (!data.losses) data.losses = undefined
		data.winRatio = parseInt($('.WinRatioGraph .Text').text().replace('%',''))
		if (!data.winRatio) data.winRatio = undefined

		recent.winRatio = parseInt($('.GameAverageStats .WinRatioGraph .Text').text().slice(0,-1))

		var temp = $('.GameAverageStats .WinRatioTitle').text().split('\n')

		if (temp && temp.length > 0 && temp[2]) {
		  recent.wins = parseInt(temp[2].slice(0,-1))
		  recent.losses = parseInt(temp[3].slice(0,-1))
		  recent.games = parseInt(temp[1].slice(0,-1))
		  recent.killsAverage = parseFloat($('.GameAverageStats .KDA .Kill').text())
		  recent.deathsAverage = parseFloat($('.GameAverageStats .KDA .Death').text())
		  recent.assistsAverage = parseFloat($('.GameAverageStats .KDA .Assist').text())
		  recent.kdaRatio = parseFloat($('.GameAverageStats .KDARatio .KDARatio').text().slice(0,-2))
		  recent.killParticipation = parseInt($('.GameAverageStats .KDARatio .CKRate span').text().replace('%', ''))

		  data.recent = recent

		  var games = []
		  $('.GameItemWrap').each((i,game) => {
		    var temp
		    var $ = cheerio.load(game)
		    game = {}
		    game.type = this.Strip($('.GameType').text())
		    game.timestamp = parseInt(this.Strip($('._timeago').attr('data-datetime')))
		    // game.mmr = parseInt(this.Strip($('.mmr').text()).substring(11))

		    game.length = this.Strip($('.GameLength').text())
		    var regex = new RegExp(/openDetail\((\d*)\,/g)
		    regex = regex.exec($('.Button.MatchDetail').attr('onclick'))
		    game.id = !!regex && regex.length ? parseInt(regex[1]) : undefined
		    game.result = this.Strip($('.GameResult').text())
		    game.champion = this.Strip($('.ChampionName a').text())
		    // game.championId = $('.championImage').data().championid
		    game.championImage = this.Strip($('.ChampionImage img').attr('src'))
		    game.spell1 = this.Strip($('.SummonerSpell .Spell:first-child img').attr('alt'))
		    game.spell1Image = this.Strip($('.SummonerSpell .Spell:first-child img').attr('src'))
		    game.spell2 = this.Strip($('.SummonerSpell .Spell:last-child img').attr('alt'))
		    game.spell2Image = this.Strip($('.SummonerSpell .Spell:last-child img').attr('src'))
		    game.kills = parseInt(this.Strip($('.KDA .Kill').text()))
		    game.deaths = parseInt(this.Strip($('.KDA .Death').text()))
		    game.assists = parseInt(this.Strip($('.KDA .Assist').text()))
		    game.ratio = parseFloat(this.Strip($('.KDARatio .KDARatio').text()).slice(0,-2))
		    if (isNaN(game.ratio)) game.ratio = 0
		    // game.multikill = this.Strip($('.multikill .kill').text())
		    game.level = parseInt(this.Strip($('.Stats .Level').text().replace('Level','')))


		    temp = this.Strip($('.CS .CS').text()).split(' (')
		    game.cs = parseInt(temp[0])
		    if (typeof temp[1] !== 'undefined' ) {game.csps = parseFloat(temp[1].slice(0,-1))}
		    else {game.csps = -1}
		    // game.gold = this.Strip($('.gold .gold').text())
		    // game.wardsGreenBought = parseInt(this.Strip($('.wards.sight').text()))
		    game.pinksPurchased = parseInt(this.Strip($('.wards.vision').text())) || 0
		    game.killParticipation = parseInt(this.Strip($('.CKRate').text().replace('P/Kill ','')))

		    var items = []
		    $('.Items .ItemList .Item').each((j,_item) => {
		      var $ = cheerio.load(_item)

		      var item = {}
		      var regex = new RegExp(/\/item\/(\d*)\./g)
		      item.name = this.Strip($('img').attr('alt'))
		      item.image = this.Strip($('img').attr('src'))
		      item.slot = j+1
		      regex = regex.exec(item.image)
		      item.id = !!regex && regex.length ? parseInt(regex[1]) : undefined
		      items.push(item)
		    });
		    game.items = items

		    var trinket = {}
		    trinket.name = this.Strip($('.TrinketWithItem img').attr('alt'))
		    trinket.image = this.Strip($('.TrinketWithItem img').attr('src'))
		    trinket.slot = 7
		    var regex = new RegExp(/\/item\/(\d*)\./g)
		    regex = regex.exec(trinket.image)
		    trinket.id = !!regex && regex.length ? parseInt(regex[1]) : undefined

		    game.items.push(trinket)

		    var players = [];
		    $('.FollowPlayers .Team .Summoner').each((j,_player) => {
		      var $ = cheerio.load(_player)

		      var player = {}
		      if (j <= 5) {player.teamSide = "Blue";}
		      else {player.teamSide = "Red";}
		      player.teamSlot = j <= 4 ? j+1 : j-4

		      player.championName = this.Strip($('.ChampionImage .Image').text())
		      player.championImage = this.Strip($('.ChampionImage .Image').css('background-image'))
		      player.name = this.Strip($('.SummonerName a').text())
		      players.push(player)

		      if (j == 4) {
		      	game.team1 = players
		      	players = []
		      } else if (j == 9) {
		      	game.team2 = players
		      }
		    })

		    games.push(game)
		  })
		  data.games = games
		  return data
		} else {
			return data
		}
	}
}