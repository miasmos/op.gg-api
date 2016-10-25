'use strict'
module.exports = class Validate {
	static Region(region) {
		return !!region && region.length && ['kr','na','euw','eune','oce','br','ru','las','lan','tr'].indexOf(region) > -1
	}

	static SummonerName(name) {
		return !!name && name.length && name.length < 16 && name.length > 3
	}

	static GameId(gameid) {
		return !!gameid && gameid % 1 == 0 && parseInt(gameid) >= 1000000000
	}

	static SummonerId(id) {
		return !!id && id >= 10000
	}

	static Season(season) {
		return !!season && ((season >= 1 && season <= 6) || season == 'normal')
	}

	static RiotAPIKey(key) {
		var regex = key.match(/[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/g)
		return !!regex && regex.length
	}

	static Timestamp(timestamp) {
		return !!timestamp && parseInt(timestamp) >= 1000000000
	}

	static StatsGraphType(type) {
		return !!type && ['win', 'lose', 'picked', 'banned'].indexOf(type) > -1
	}

	static StatsLeague(league) {
		if (league == 'all') league = ''
		return !!league && ['all', 'bronze', 'silver', 'gold', 'platinum', 'diamond', 'challenger']
	}

	static StatsPeriod(time) {
		return !!time && ['month', 'week', 'today'].indexOf(time) > -1
	}

	static StatsMap(map) {
		return !!map && [1, 10, 12].indexOf(map) > -1
	}

	static StatsQueueType(queue) {
		return !!queue && ['ranked', 'normal', 'aram'].indexOf(queue) > -1
	}
}