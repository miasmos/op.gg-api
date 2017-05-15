'use strict'
module.exports = class Validate {
	static Region(region) {
		return ['kr','na','euw','eune','oce','br','ru','las','lan','tr'].indexOf(region) > -1
	}

	static Summoner(name) {
		return !!name && name.length && name.length <= 16 && name.length >= 3
	}

	static GameId(gameid) {
		return !!gameid && gameid % 1 == 0 && parseInt(gameid) >= 1000000000
	}

	static SummonerId(id) {
		return !!id && id >= 10000
	}

	static Season(season) {
		return !!season && ((season >= 1 && season <= 7) || season == 'normal')
	}

	static RiotAPIKey(key) {
		var regex = new RegExp(/[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/g)
		regex = regex.exec(key)
		return !!regex && regex.length
	}

	static Timestamp(timestamp) {
		return !!timestamp && parseInt(timestamp) >= 1000000000
	}

	static StatsGraphType(type) {
		return ['win', 'lose', 'picked', 'banned'].indexOf(type) > -1
	}

	static StatsLeague(league) {
		if (league == 'all') league = ''
		return ['', 'bronze', 'silver', 'gold', 'platinum', 'diamond', 'challenger'].indexOf(league) > -1
	}

	static StatsPeriod(time) {
		return ['month', 'week', 'today'].indexOf(time) > -1
	}

	static StatsMap(map) {
		return [1, 10, 12].indexOf(map) > -1
	}

	static StatsQueueType(queue) {
		return ['ranked', 'normal', 'aram'].indexOf(queue) > -1
	}

	static Role(role) {
		return ['support', 'mid', 'adc', 'top', 'jungle'].indexOf(role) > -1
	}

	static ChampionName(name) {
		var regex = new RegExp(/^[a-zA-Z ']+$/g)
		regex = regex.exec(name)
		return !!regex && regex.length
	}
}