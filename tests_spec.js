var frisby = require('frisby'),
	base = 'http://localhost:1337'

frisby.create('/:region/live')
	.get(`${base}/na/live`)
	.expectStatus(200)
	.expectJSONTypes('data.?', {
		"timestamp": Number,
		"gametype": String,
		"champion": {
			"name": String,
			"image": String
		},
		"matchId": Number,
		"name": String,
		"team": String,
		"teamLogo": String,
		"alias": String
	})
	.toss()

frisby.create('/:region/summary/:summoner with a summoner that hasn\'t played any games')
	.get(`${base}/na/summary/Blank Profile`)
	.expectStatus(200)
	.expectJSONTypes('data', {
		"summonerId": Number,
		"league": String,
		"lp": (val) => {expect(val).toBeTypeOrNull(Number)},
		"wins": (val) => {expect(val).toBeTypeOrNull(Number)},
		"losses": (val) => {expect(val).toBeTypeOrNull(Number)},
		"winRatio": (val) => {expect(val).toBeTypeOrNull(Number)}
	})
	.toss()

frisby.create('/:region/summary/:summoner with a summoner that has played some games')
	.get(`${base}/na/summary/Doublelift`)
	.expectStatus(200)
	.expectJSONTypes('data', {
		"summonerId": Number,
		"league": String,
		"lp": Number,
		"wins": Number,
		"losses": Number,
		"winRatio": Number,
		"recent": {
			"winRatio": Number,
			"wins": Number,
			"losses": Number,
			"games": Number,
			"killsAverage": Number,
			"deathsAverage": Number,
			"assistsAverage": Number,
			"kdaRatio": Number,
			"killParticipation": Number
		}
	})
	.expectJSONTypes('data.games.?', {
		"type": String,
		"timestamp": Number,
		"length": String,
		"id": Number,
		"result": String,
		"champion": String,
		"championImage": String,
		"spell1": String,
		"spell1Image": String,
		"spell2": String,
		"spell2Image": String,
		"kills": Number,
		"deaths": Number,
		"assists": Number,
		"ratio": Number,
		"level": Number,
		"cs": Number,
		"csps": Number,
		"pinksPurchased": Number,
		"killParticipation": Number
	})
	.expectJSONTypes('data.games.0.items.?', {
		"name": String,
		"image": String,
		"slot": Number,
		"id": Number
	})
	.expectJSONTypes('data.games.0.team1.?', {
		"teamSide": String,
		"teamSlot": Number,
		"championName": String,
		"name": String
	})
	.expectJSONTypes('data.games.0.team2.?', {
		"teamSide": String,
		"teamSlot": Number,
		"championName": String,
		"name": String
	})
	.toss()

frisby.create('/:region/summary/:summoner/ranked with a summoner that hasn\'t played any games')
	.get(`${base}/na/summary/Blank Profile/ranked`)
	.expectStatus(601)
	.toss()

frisby.create('/:region/summary/:summoner/ranked with a summoner that has played some games')
	.get(`${base}/na/summary/Doublelift/ranked`)
	.expectStatus(200)
	.expectJSONTypes('data', {
		"summonerId": Number,
		"league": String,
		"lp": Number,
		"wins": Number,
		"losses": Number,
		"winRatio": Number,
		"recent": {
			"winRatio": Number,
			"wins": Number,
			"losses": Number,
			"games": Number,
			"killsAverage": Number,
			"deathsAverage": Number,
			"assistsAverage": Number,
			"kdaRatio": Number,
			"killParticipation": Number
		}
	})
	.expectJSONTypes('data.games.?', {
		"type": String,
		"timestamp": Number,
		"length": String,
		"id": Number,
		"result": String,
		"champion": String,
		"championImage": String,
		"spell1": String,
		"spell1Image": String,
		"spell2": String,
		"spell2Image": String,
		"kills": Number,
		"deaths": Number,
		"assists": Number,
		"ratio": Number,
		"level": Number,
		"cs": Number,
		"csps": Number,
		"pinksPurchased": Number,
		"killParticipation": Number
	})
	.expectJSONTypes('data.games.0.items.?', {
		"name": String,
		"image": String,
		"slot": Number,
		"id": Number
	})
	.expectJSONTypes('data.games.0.team1.?', {
		"teamSide": String,
		"teamSlot": Number,
		"championName": String,
		"name": String
	})
	.expectJSONTypes('data.games.0.team2.?', {
		"teamSide": String,
		"teamSlot": Number,
		"championName": String,
		"name": String
	})
	.toss()

frisby.create('/:region/summary/:summoner/normal with a summoner that hasn\'t played any games')
	.get(`${base}/na/summary/Blank Profile/normal`)
	.expectStatus(601)
	.toss()

frisby.create('/:region/summary/:summoner/normal with a summoner that has played some games')
	.get(`${base}/na/summary/Doublelift/normal`)
	.expectStatus(200)
	.expectJSONTypes('data', {
		"summonerId": Number,
		"league": String,
		"lp": Number,
		"wins": Number,
		"losses": Number,
		"winRatio": Number,
		"recent": {
			"winRatio": Number,
			"wins": Number,
			"losses": Number,
			"games": Number,
			"killsAverage": Number,
			"deathsAverage": Number,
			"assistsAverage": Number,
			"kdaRatio": Number,
			"killParticipation": Number
		}
	})
	.expectJSONTypes('data.games.?', {
		"type": String,
		"timestamp": Number,
		"length": String,
		"id": Number,
		"result": String,
		"champion": String,
		"championImage": String,
		"spell1": String,
		"spell1Image": String,
		"spell2": String,
		"spell2Image": String,
		"kills": Number,
		"deaths": Number,
		"assists": Number,
		"ratio": Number,
		"level": Number,
		"cs": Number,
		"csps": Number,
		"pinksPurchased": Number,
		"killParticipation": Number
	})
	.expectJSONTypes('data.games.0.items.?', {
		"name": String,
		"image": String,
		"slot": Number,
		"id": Number
	})
	.expectJSONTypes('data.games.0.team1.?', {
		"teamSide": String,
		"teamSlot": Number,
		"championName": String,
		"name": String
	})
	.expectJSONTypes('data.games.0.team2.?', {
		"teamSide": String,
		"teamSlot": Number,
		"championName": String,
		"name": String
	})
	.toss()

frisby.create('/:region/champions with a summoner that hasn\'t played any games')
	.get(`${base}/na/champions/Blank Profile`)
	.expectStatus(601)
	.toss()

frisby.create('/:region/champions with a summoner that has played some games')
	.get(`${base}/na/champions/Doublelift`)
	.expectStatus(200)
	.expectJSONTypes('data.?', {
		"rank": Number,
		"name": String,
		"wins": Number,
		"losses": Number,
		"winRatio": Number,
		"kills": Number,
		"deaths": Number,
		"assists": Number,
		"ratio": Number,
		"gold": Number,
		"cs": Number,
		"turrets": Number,
		"maxKills": Number,
		"maxDeaths": Number,
		"damageDealt": Number,
		"damageTaken": Number,
		"doubleKill": Number,
		"tripleKill": Number,
		"quadraKill": Number
	})
	.toss()

frisby.create('/:region/league with a summoner that hasn\'t played any games')
	.get(`${base}/na/league/Blank Profile`)
	.expectStatus(601)
	.toss()

frisby.create('/:region/league with a summoner that has played some games')
	.get(`${base}/na/league/Doublelift`)
	.expectStatus(200)
	.expectJSONTypes('data', {
		"rank": String,
		"name": String,
	})
	.expectJSONTypes('data.summoners.?', {
		"place": Number,
		"image": String,
		"name": String,
		"emblems": {
			veteran: Boolean,
			hot: Boolean,
			recruit: Boolean,
			inactive: Boolean
		},
		"wins": Number,
		"losses": Number,
		"winRatio": Number,
		"lp": Number,
		"series": Object
	})
	.toss()

frisby.create('/:region/runes with a summoner that doesn\'t have any')
	.get(`${base}/na/runes/Blank Profile`)
	.expectStatus(601)
	.toss()

frisby.create('/:region/runes with a summoner that has some')
	.get(`${base}/na/runes/Doublelift`)
	.expectStatus(200)
	.expectJSONTypes('data.?', {
		"title": String
	})
	.expectJSONTypes('data.0.mark.?', {
		"image": String,
		"name": String,
		"effect": String,
		"count": Number
	})
	.expectJSONTypes('data.0.seal.?', {
		"image": String,
		"name": String,
		"effect": String,
		"count": Number
	})
	.expectJSONTypes('data.0.glyph.?', {
		"image": String,
		"name": String,
		"effect": String,
		"count": Number
	})
	.expectJSONTypes('data.0.quintessence.?', {
		"image": String,
		"name": String,
		"effect": String,
		"count": Number
	})
	.toss()

frisby.create('/:region/masteries with a summoner that doesn\'t have any')
	.get(`${base}/na/masteries/Blank Profile`)
	.expectStatus(601)
	.toss()

frisby.create('/:region/masteries with a summoner that has some')
	.get(`${base}/na/masteries/Doublelift`)
	.expectStatus(200)
	.expectJSONTypes('data.?', {
		"title": String,
		"masteries": {
			"offense": Object,
			"defense": Object,
			"utility": Object,
		}
	})
	.expectJSONTypes('data.0.masteries.offense', {
		"ranks": Array,
		"total": Number
	})
	.expectJSONTypes('data.0.masteries.offense.ranks.?', {
		"rank": Number,
		"name": String,
		"position": Number
	})
	.expectJSONTypes('data.0.masteries.defense', {
		"ranks": Array,
		"total": Number
	})
	.expectJSONTypes('data.0.masteries.defense.ranks.?', {
		"rank": Number,
		"name": String,
		"position": Number
	})
	.expectJSONTypes('data.0.masteries.utility', {
		"ranks": Array,
		"total": Number
	})
	.expectJSONTypes('data.0.masteries.utility.ranks.?', {
		"rank": Number,
		"name": String,
		"position": Number
	})
	.toss()

frisby.create('/:region/matches with a summoner that doesn\'t have any')
	.get(`${base}/na/matches/Blank Profile`)
	.expectStatus(601)
	.toss()

frisby.create('/:region/matches with a summoner that has some')
	.get(`${base}/na/matches/Doublelift`)
	.expectStatus(200)
	.expectJSONTypes('data.?', {
		"type": String,
		"timestamp": Number,
		"length": String,
		"id": Number,
		"result": String,
		"champion": String,
		"championImage": String,
		"spell1": String,
		"spell1Image": String,
		"spell2": String,
		"spell2Image": String,
		"kills": Number,
		"deaths": Number,
		"assists": Number,
		"ratio": Number,
		"level": Number,
		"cs": Number,
		"csps": Number,
		"pinksPurchased": Number,
		"killParticipation": Number
	})
	.expectJSONTypes('data.0.items.?', {
		"name": String,
		"image": String,
		"slot": Number,
		"id": Number
	})
	.expectJSONTypes('data.0.team1.?', {
		"teamSide": String,
		"teamSlot": Number,
		"championName": String,
		"name": String
	})
	.expectJSONTypes('data.0.team2.?', {
		"teamSide": String,
		"teamSlot": Number,
		"championName": String,
		"name": String
	})
	.toss()

frisby.create('/:region/stats')
	.get(`${base}/na/stats`)
	.expectStatus(200)
	.expectJSONTypes('data.?', {
		"rank": Number,
		"name": String,
		"winrate": Number,
		"games": Number,
		"kda": Number,
		"cs": Number,
		"gold": Number
	})
	.toss()

frisby.create('/:region/analytics/summary')
	.get(`${base}/na/analytics/summary`)
	.expectStatus(200)
	.expectJSONTypes('data', {
		"patch": Number,
		"winrate": {
			"top": Array,
			"jungle": Array,
			"middle": Array,
			"adc": Array,
			"support": Array
		},
		"pickrate": {
			"top": Array,
			"jungle": Array,
			"middle": Array,
			"adc": Array,
			"support": Array
		},
		"banrate": Array
	})
	.expectJSONTypes('data.winrate.top.?', {
		"place": Number,
		"name": String,
		"percent": Number
	})
	.expectJSONTypes('data.winrate.jungle.?', {
		"place": Number,
		"name": String,
		"percent": Number
	})
	.expectJSONTypes('data.winrate.middle.?', {
		"place": Number,
		"name": String,
		"percent": Number
	})
	.expectJSONTypes('data.winrate.adc.?', {
		"place": Number,
		"name": String,
		"percent": Number
	})
	.expectJSONTypes('data.winrate.support.?', {
		"place": Number,
		"name": String,
		"percent": Number
	})
	.expectJSONTypes('data.pickrate.top.?', {
		"place": Number,
		"name": String,
		"percent": Number
	})
	.expectJSONTypes('data.pickrate.jungle.?', {
		"place": Number,
		"name": String,
		"percent": Number
	})
	.expectJSONTypes('data.pickrate.middle.?', {
		"place": Number,
		"name": String,
		"percent": Number
	})
	.expectJSONTypes('data.pickrate.adc.?', {
		"place": Number,
		"name": String,
		"percent": Number
	})
	.expectJSONTypes('data.pickrate.support.?', {
		"place": Number,
		"name": String,
		"percent": Number
	})
	.expectJSONTypes('data.banrate.?', {
		"place": Number,
		"name": String,
		"percent": Number
	})
	.toss()

frisby.create('/:region/analytics/champion')
	.get(`${base}/na/analytics/champion?champion=Lucian&role=adc`)
	.expectStatus(200)
	.expectJSONTypes('data', {
		"patch": Number,
		"banrateRank": Number,
		"banrate": Number,
		"roles": Array,
		"skills": {
			"order": Array,
			"pickrate": Number,
			"pickrateSample": Number,
			"winrate": Number
		},
		"spells": Array,
		"starterItems": Array,
		"coreItems": Array,
		"boots": Array,
		"keystones": Array,
		"masteries": Array,
		"runes": Array,
		"charts": {
			"winrate": Array,
			"pickrate": Array,
			"gamelengthwinrate": Array
		}
	})
	.expectJSONTypes('data.roles.?', {
		"role": String,
		"rolePercent": Number,
		"winrateRank": Number,
		"winrate": Number,
		"pickrateRank": Number,
		"pickrate": Number,
		"position": Number
	})
	.expectJSONTypes('data.skills.order.?', {
		"place": Number,
		"button": String
	})
	.expectJSONTypes('data.spells.?', {
		"pickrate": Number,
		"pickrateSample": Number,
		"winrate": Number,
		"spells": Array
	})
	.expectJSONTypes('data.spells.0.spells.?', {
		"image": String,
		"name": String
	})
	.expectJSONTypes('data.starterItems.?', {
		"pickrate": Number,
		"pickrateSample": Number,
		"winrate": Number,
		"items": Array
	})
	.expectJSONTypes('data.starterItems.0.items', {
		"image": String,
		"name": String,
		"id": Number
	})
	.expectJSONTypes('data.coreItems.?', {
		"pickrate": Number,
		"pickrateSample": Number,
		"winrate": Number,
		"items": Array
	})
	.expectJSONTypes('data.coreItems.0.items', {
		"image": String,
		"name": String,
		"id": Number
	})
	.expectJSONTypes('data.boots.?', {
		"pickrate": Number,
		"pickrateSample": Number,
		"winrate": Number,
		"image": String,
		"name": String,
		"id": Number
	})
	.expectJSONTypes('data.keystones.?', {
		"pickrate": Number,
		"pickrateSample": Number,
		"winrate": Number,
		"image": String,
		"name": String,
		"id": Number
	})
	.expectJSONTypes('data.masteries.?', {
		"title": String,
		"masteries": {
			"offense": Object,
			"defense": Object,
			"utility": Object,
		}
	})
	.expectJSONTypes('data.masteries.0.masteries.offense', {
		"ranks": Array,
		"total": Number
	})
	.expectJSONTypes('data.masteries.0.masteries.offense.ranks.?', {
		"rank": Number,
		"name": String,
		"position": Number
	})
	.expectJSONTypes('data.masteries.0.masteries.defense', {
		"ranks": Array,
		"total": Number
	})
	.expectJSONTypes('data.masteries.0.masteries.defense.ranks.?', {
		"rank": Number,
		"name": String,
		"position": Number
	})
	.expectJSONTypes('data.masteries.0.masteries.utility', {
		"ranks": Array,
		"total": Number
	})
	.expectJSONTypes('data.masteries.0.masteries.utility.ranks.?', {
		"rank": Number,
		"name": String,
		"position": Number
	})
	.expectJSONTypes('data.runes.?', {
		"pickrate": Number,
		"pickrateSample": Number,
		"winrate": Number,
		"items": Array
	})
	.expectJSONTypes('data.runes.0.items', {
		"image": String,
		"type": String,
		"count": Number
	})
	.expectJSONTypes('data.charts.winrate.?', {
		"rank": Number,
		"winrate": Number,
		"patch": Number,
		"date": String
	})
	.expectJSONTypes('data.charts.pickrate.?', {
		"rank": Number,
		"winrate": Number,
		"patch": Number,
		"date": String
	})
	.expectJSONTypes('data.charts.gamelengthwinrate.?', {
		"rank": Number,
		"winrate": Number
	})
	.toss()

frisby.create('/:region/analytics/champion/items')
	.get(`${base}/na/analytics/champion/items?champion=Lucian&role=adc`)
	.expectStatus(200)
	.expectJSONTypes('data.?', {
		"pickrate": Number,
		"pickrateSample": Number,
		"winrate": Number,
		"image": String,
		"name": String,
		"id": Number
	})
	.toss()

frisby.create('/:region/analytics/champion/skills')
	.get(`${base}/na/analytics/champion/skills?champion=Lucian&role=adc`)
	.expectStatus(200)
	.expectJSONTypes('data.?', {
		"order": Array,
		"pickrate": Number,
		"pickrateSample": Number,
		"winrate": Number
	})
	.toss()

frisby.create('/:region/analytics/champion/runes')
	.get(`${base}/na/analytics/champion/runes?champion=Lucian&role=adc`)
	.expectStatus(200)
	.expectJSONTypes('data.?', {
		"pickrate": Number,
		"pickrateSample": Number,
		"winrate": Number,
		"items": Array
	})
	.expectJSONTypes('data.0.items.?', {
		"image": String,
		"type": String,
		"count": Number
	})
	.toss()

frisby.create('/:region/analytics/champion/masteries')
	.get(`${base}/na/analytics/champion/masteries?champion=Lucian&role=adc`)
	.expectStatus(200)
	.expectJSONTypes('data.masteries.?', {
		"masteries": {
			"offense": Object,
			"defense": Object,
			"utility": Object,
		}
	})
	.expectJSONTypes('data.masteries.0.masteries.offense', {
		"ranks": Array,
		"total": Number
	})
	.expectJSONTypes('data.masteries.0.masteries.offense.ranks.?', {
		"rank": Number,
		"name": String,
		"position": Number
	})
	.expectJSONTypes('data.masteries.0.masteries.defense', {
		"ranks": Array,
		"total": Number
	})
	.expectJSONTypes('data.masteries.0.masteries.defense.ranks.?', {
		"rank": Number,
		"name": String,
		"position": Number
	})
	.expectJSONTypes('data.masteries.0.masteries.utility', {
		"ranks": Array,
		"total": Number
	})
	.expectJSONTypes('data.masteries.0.masteries.utility.ranks.?', {
		"rank": Number,
		"name": String,
		"position": Number
	})
	.expectJSONTypes('data.keystones.?', {
		"pickrate": Number,
		"pickrateSample": Number,
		"winrate": Number,
		"image": String,
		"name": String,
		"id": Number
	})
	.toss()

frisby.create('/:region/match/:matchId')
	.get(`${base}/na/match/2330709500?summoner=Doublelift`)
	.expectStatus(200)
	.expectJSONTypes('data.team1', {
		"players": Array,
		"result": String,
		"color": String,
		"kills": Number,
		"deaths": Number,
		"assists": Number,
		"barons": Number,
		"dragons": Number,
		"towers": Number
	})
	.expectJSONTypes('data.team2', {
		"players": Array,
		"result": String,
		"color": String,
		"kills": Number,
		"deaths": Number,
		"assists": Number,
		"barons": Number,
		"dragons": Number,
		"towers": Number
	})
	.expectJSONTypes('data.team1.players.?', {
		"champion": String,
		"level": Number,
		"spells": {
			"spell1Name": String,
			"spell1Image": String,
			"spell2Name": String,
			"spell2Image": String
		},
		"keystone": {
			"name": String,
			"image": String,
			"id": Number
		},
		"name": String,
		"items": Array
	})
	.expectJSONTypes('data.team1.players.0.items.?', {
		"name": String,
		"image": String,
		"id": Number
	})
	.expectJSONTypes('data.team2.players.?', {
		"champion": String,
		"level": Number,
		"spells": {
			"spell1Name": String,
			"spell1Image": String,
			"spell2Name": String,
			"spell2Image": String
		},
		"keystone": {
			"name": String,
			"image": String,
			"id": Number
		},
		"name": String,
		"items": Array
	})
	.expectJSONTypes('data.team2.players.0.items.?', {
		"name": String,
		"image": String,
		"id": Number
	})
	.toss()