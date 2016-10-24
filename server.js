'use strict'
let express = require('express'),
	http = require('http'),
	parse = require('./lib/Parser/Parser'),
	validate = require('./lib/validate'),
	response = require('./lib/Responses/Response'),
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
	resolve('api_key' in req.query, 'api_key', validate.RiotAPIKey, errorMessages.INVALID_API_KEY, responseCodes.BAD_REQUEST)

	function resolve(shouldValidate, querystring, validateFn, errorMessage, errorCode) {
		if (shouldValidate) {
			if (validateFn.call(this, req.query[querystring])) {	//validated successfully
				next()
			} else {
				res.json(response.Error(new Error(errorMessage, errorCode)))
			}
		} else {
			next()
		}
	}
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

app.get('/:region/renew/:summonerId', (req,res) => {
	parse.Renew(req.params.region, req.params.summonerId)
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

app.get('/:region/champions/:summoner', Champions)
app.get('/:region/champions/:summoner/:season', Champions)
function Champions(req,res) {
	return parse.Champions(req.params.region, req.params.summoner, req.params.season ? req.params.season : 6)
		.then((data) => {
			res.send(response.Ok(data))
		})
		.catch((error) => {
			res.send(response.Error(error))
		})
}

app.get('/:region/league/:summoner', (req,res) => {
	return parse.League(req.params.region, req.params.summoner)
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
	return parse.Stats(req.params.region)
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
