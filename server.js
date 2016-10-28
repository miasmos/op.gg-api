'use strict'
let express = require('express'),
	http = require('http'),
	parse = require('./lib/Parser/Parser'),
	validate = require('./lib/validate'),
	response = require('./lib/Responses/Response'),
	utils = require('./lib/utils'),
	Error = require('./lib/Responses/Error'),
	errorMessages = require('./lib/Responses/error_messages.json'),
	responseCodes = require('./lib/Responses/response_codes.json'),
	fs = require('fs'),
	app = express()

app.set('json spaces', 4)

app.param('region', (req,res,next,id) => {
  if (!validate.Region(req.params.region)) {
    res.json(response.Error(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST)))
    return
  }
  next()
})

app.param('summoner', (req,res,next,id) => {
  if (!validate.SummonerName(req.params.summoner)) {
    res.json(response.Error(new Error(errorMessages.INVALID_PARAM_SUMMONER_NAME, responseCodes.BAD_REQUEST)))
    return
  }
  next()
})

app.param('gamenum', (req,res,next,id) => {
  if (!validate.GameId(req.params.gamenum)) {
    res.json(response.Error(new Error(errorMessages.INVALID_PARAM_GAME_ID, responseCodes.BAD_REQUEST)))
    return
  }
	next()
})

app.param('summonerId', (req,res,next,id) => {
  if (!validate.SummonerId(req.params.summonerId)) {
    res.json(response.Error(new Error(errorMessages.INVALID_PARAM_SUMMONER_ID, responseCodes.BAD_REQUEST)))
    return
  }
	next()
})

app.param('season', (req,res,next,id) => {
  if (!validate.Season(req.params.season)) {
    res.json(response.Error(new Error(errorMessages.INVALID_PARAM_SEASON, responseCodes.BAD_REQUEST)))
    return
  }
	next()
})

app.param('timestamp', (req,res,next,id) => {
  if (!validate.Timestamp(req.params.timestamp)) {
    res.json(response.Error(new Error(errorMessages.INVALID_PARAM_TIMESTAMP, responseCodes.BAD_REQUEST)))
    return
  }
	next()
})

app.use((req, res, next) => {
	var params = [
		{
			shouldValidate: 'api_key' in req.query,
			querystring: 'api_key',
			function: validate.RiotAPIKey,
			error: errorMessages.INVALID_API_KEY,
			code: responseCodes.BAD_REQUEST
		},
		{
			shouldValidate: 'type' in req.query && utils.IsEndpoint('/:region/stats', req.path),
			querystring: 'type',
			function: validate.StatsGraphType,
			error: errorMessages.INVALID_PARAM_STATS_GRAPH_TYPE,
			code: responseCodes.BAD_REQUEST
		},
		{
			shouldValidate: 'league' in req.query && utils.IsEndpoint('/:region/stats', req.path),
			querystring: 'league',
			function: validate.StatsLeague,
			error: errorMessages.INVALID_PARAM_STATS_LEAGUE,
			code: responseCodes.BAD_REQUEST
		},
		{
			shouldValidate: 'period' in req.query && utils.IsEndpoint('/:region/stats', req.path),
			querystring: 'period',
			function: validate.StatsPeriod,
			error: errorMessages.INVALID_PARAM_STATS_PERIOD,
			code: responseCodes.BAD_REQUEST
		},
		{
			shouldValidate: 'mapId' in req.query && utils.IsEndpoint('/:region/stats', req.path),
			querystring: 'mapId',
			function: validate.StatsMap,
			error: errorMessages.INVALID_PARAM_STATS_MAP,
			code: responseCodes.BAD_REQUEST
		},
		{
			shouldValidate: 'queue' in req.query && utils.IsEndpoint('/:region/stats', req.path),
			querystring: 'queue',
			function: validate.StatsQueueType,
			error: errorMessages.INVALID_PARAM_STATS_QUEUE,
			code: responseCodes.BAD_REQUEST
		},
		{
			shouldValidate: 'champion' in req.query && utils.IsEndpoint('/analytics/champion', req.path),
			querystring: 'champion',
			function: validate.ChampionName,
			error: errorMessages.INVALID_PARAM_CHAMPION_NAME,
			code: responseCodes.BAD_REQUEST
		},
		{
			shouldValidate: 'role' in req.query && utils.IsEndpoint('/analytics/champion', req.path),
			querystring: 'role',
			function: validate.Role,
			error: errorMessages.INVALID_PARAM_ROLE,
			code: responseCodes.BAD_REQUEST
		},
	]

	for (var param in params) {
		var obj = params[param]
		if (obj.shouldValidate) {
			if (!obj.function.call(this, req.query[obj.querystring])) {
				res.json(response.Error(new Error(obj.error, obj.code)))
				return
			}
		}
	}
	next()
})

app.get('/:region/live', (req,res) => {
	parse.Live(req.params.region, req.query.api_key)
		.then((data) => {
			res.json(response.Ok(data))
		})
		.catch((error) => {
			res.json(response.Error(error))
		})
})

app.get('/:region/renew', (req,res) => {
	parse.Renew(req.params.region, req.query.summonerId)
		.then((data) => {
			res.send(response.Ok(data))
		})
		.catch((error) => {
			res.send(response.Error(error))
		})
})

app.get('/:region/summary/:summoner', SummaryCombined)
app.get('/:region/summary/:summoner/combined', SummaryCombined)
function SummaryCombined(req,res) {
	return parse.SummaryCombined(req.params.region, req.params.summoner)
		.then((data) => {
			res.send(response.Ok(data))
		})
		.catch((error) => {
			res.send(response.Error(error))
		})
}

app.get('/:region/summary/:summoner/ranked', (req,res) => {
	parse.SummaryRanked(req.params.region, req.params.summoner)
		.then((data) => {
			res.send(response.Ok(data))
		})
		.catch((error) => {
			res.send(response.Error(error))
		})
})

app.get('/:region/summary/:summoner/normal', (req,res) => {
	parse.SummaryNormal(req.params.region, req.params.summoner)
		.then((data) => {
			res.send(response.Ok(data))
		})
		.catch((error) => {
			res.send(response.Error(error))
		})
})

app.get('/:region/champions/:summoner', (req,res) => {
	return parse.Champions(req.params.region, req.params.summoner, req.query.season ? req.query.season : 6)
		.then((data) => {
			res.send(response.Ok(data))
		})
		.catch((error) => {
			res.send(response.Error(error))
		})
})

app.get('/:region/league/:summoner', (req,res) => {
	return parse.League(req.params.region, req.params.summoner)
		.then((data) => {
			res.send(response.Ok(data))
		})
		.catch((error) => {
			res.send(response.Error(error))
		})
})

app.get('/:region/runes/:summoner/', (req, res) => {
	return parse.Runes(req.params.region, req.params.summoner)
		.then((data) => {
			res.send(response.Ok(data))
		})
		.catch((error) => {
			res.send(response.Error(error))
		})
})

app.get('/:region/masteries/:summoner/', (req, res) => {
	return parse.Masteries(req.params.region, req.params.summoner)
		.then((data) => {
			res.send(response.Ok(data))
		})
		.catch((error) => {
			res.send(response.Error(error))
		})
})

app.get('/:region/matches/:summoner/', (req, res) => {
	return parse.Matches(req.params.region, req.params.summoner)
		.then((data) => {
			res.send(response.Ok(data))
		})
		.catch((error) => {
			res.send(response.Error(error))
		})
})

app.get('/:region/matches/:summoner/:timestamp', (req,res) => {
	return parse.MatchesByTimestamp(req.params.region, req.params.summoner, req.params.timestamp)
		.then((data) => {
			res.send(response.Ok(data))
		})
		.catch((error) => {
			res.send(response.Error(error))
		})
})

app.get('/:region/stats/', (req, res) => {
	return parse.Stats(req.params.region, req.query.type, req.query.league, req.query.period, req.query.mapId, req.query.queue)
		.then((data) => {
			res.send(response.Ok(data))
		})
		.catch((error) => {
			res.send(response.Error(error))
		})
})

app.get('/:region/analytics/summary', (req, res) => {
	return parse.Analytics(req.params.region)
		.then((data) => {
			res.send(response.Ok(data))
		})
		.catch((error) => {
			res.send(response.Error(error))
		})
})

app.get('/:region/analytics/champion', (req, res) => {
	return parse.AnalyticsByChampion(req.params.region, req.query.champion, req.query.role)
		.then((data) => {
			res.send(response.Ok(data))
		})
		.catch((error) => {
			res.send(response.Error(error))
		})
})

app.get('/:region/analytics/champion/items', (req, res) => {
	return parse.AnalyticsByChampionItems(req.params.region, req.query.champion, req.query.role)
		.then((data) => {
			res.send(response.Ok(data))
		})
		.catch((error) => {
			res.send(response.Error(error))
		})
})

app.get('/:region/analytics/champion/skills', (req, res) => {
	return parse.AnalyticsByChampionSkills(req.params.region, req.query.champion, req.query.role)
		.then((data) => {
			res.send(response.Ok(data))
		})
		.catch((error) => {
			res.send(response.Error(error))
		})
})

app.get('/:region/analytics/champion/runes', (req, res) => {
	return parse.AnalyticsByChampionRunes(req.params.region, req.query.champion, req.query.role)
		.then((data) => {
			res.send(response.Ok(data))
		})
		.catch((error) => {
			res.send(response.Error(error))
		})
})

app.get('/:region/analytics/champion/masteries', (req, res) => {
	return parse.AnalyticsByChampionMasteries(req.params.region, req.query.champion, req.query.role)
		.then((data) => {
			res.send(response.Ok(data))
		})
		.catch((error) => {
			res.send(response.Error(error))
		})
})

app.get('*', (req, res) => {
	res.json(response.Error(new Error(errorMessages.NOT_FOUND, responseCodes.NOT_FOUND)))
})

http.createServer(app).listen(1337, function() {
  console.log('Listening on port 1337')
})
