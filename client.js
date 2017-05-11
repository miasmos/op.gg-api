'use strict'
let parse = require('./lib/Parser/Parser'),
    errorMessages = require('./lib/Responses/error_messages.json'),
    responseCodes = require('./lib/Responses/response_codes.json'),
    Error = require('./lib/Responses/Error'),
    response = require('./lib/Responses/Response'),
    validate = require('./lib/validate'),
    Promise = require('bluebird')


module.exports = class opgg {
  constructor(opts) {
    if (!opts) opts = {}
    this.api_key = opts.api_key ? opts.api_key : undefined
    if (!!this.api_key && !validate.RiotAPIKey(this.api_key)) throw new Error(error.INVALID_API_KEY)
  }

  Live(region, callback) {
    let validated = validate.Region(region)

    if (typeof callback === 'function') {
      if (!validated) {
        callback(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST), undefined)
      } else {
        parse.Live(region, this.api_key)
          .then((json) => {
            callback(undefined, json)
          })
          .catch((error) => {
            callback(error, undefined)
          })
      }
    } else {
      return new Promise((resolve, reject) => {
          if (!validated) reject(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST))
          else resolve(parse.Live(region, this.api_key))
      })
    }
  }

  Renew(region, summonerId, callback) {
    let validated = {
      region: validate.Region(region),
      summonerId: validate.SummonerId(summonerId)
    }

    if (typeof callback === 'function') {
      if (!validated.region) {
        callback(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST), undefined)
      } else if (!validated.summonerId) {
        callback(new Error(errorMessages.INVALID_PARAM_SUMMONER_ID, responseCodes.BAD_REQUEST), undefined)
      } else {
        parse.Renew(region, summonerId, this.api_key)
          .then((json) => {
            callback(undefined, json)
          })
          .catch((error) => {
            callback(error, undefined)
          })
      }
    } else {
      return new Promise((resolve, reject) => {
          if (!validated.region) reject(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST))
          else if (!validated.summonerId) reject(new Error(errorMessages.INVALID_PARAM_SUMMONER_ID, responseCodes.BAD_REQUEST))
          else resolve(parse.Renew(region, summonerId, this.api_key))
      })
    }
  }

  Summary(region, summoner, callback) {
    let validated = {
      region: validate.Region(region),
      summoner: validate.Summoner(summoner)
    }

    if (typeof callback === 'function') {
      if (!validated.region) {
        callback(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST), undefined)
      } else if (!validated.summoner) {
        callback(new Error(errorMessages.INVALID_PARAM_SUMMONER_NAME, responseCodes.BAD_REQUEST), undefined)
      } else {
        parse.SummaryCombined(region, summoner, this.api_key)
          .then((json) => {
            callback(undefined, json)
          })
          .catch((error) => {
            callback(error, undefined)
          })
      }
    } else {
      return new Promise((resolve, reject) => {
          if (!validated.region) reject(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST))
          else if (!validated.summoner) reject(new Error(errorMessages.INVALID_PARAM_SUMMONER_NAME, responseCodes.BAD_REQUEST))
          else resolve(parse.SummaryCombined(region, summoner, this.api_key))
      })
    }
  }

  SummaryRanked(region, summoner, callback) {
    let validated = {
      region: validate.Region(region),
      summoner: validate.Summoner(summoner)
    }

    if (typeof callback === 'function') {
      if (!validated.region) {
        callback(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST), undefined)
      } else if (!validated.summoner) {
        callback(new Error(errorMessages.INVALID_PARAM_SUMMONER_NAME, responseCodes.BAD_REQUEST), undefined)
      } else {
        parse.SummaryRanked(region, summoner, this.api_key)
          .then((json) => {
            callback(undefined, json)
          })
          .catch((error) => {
            callback(error, undefined)
          })
      }
    } else {
      return new Promise((resolve, reject) => {
          if (!validated.region) reject(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST))
          else if (!validated.summoner) reject(new Error(errorMessages.INVALID_PARAM_SUMMONER_NAME, responseCodes.BAD_REQUEST))
          else resolve(parse.SummaryRanked(region, summoner, this.api_key))
      })
    }
  }

  SummaryNormal(region, summoner, callback) {
    let validated = {
      region: validate.Region(region),
      summoner: validate.Summoner(summoner)
    }

    if (typeof callback === 'function') {
      if (!validated.region) {
        callback(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST), undefined)
      } else if (!validated.summoner) {
        callback(new Error(errorMessages.INVALID_PARAM_SUMMONER_NAME, responseCodes.BAD_REQUEST), undefined)
      } else {
        parse.SummaryNormal(region, summoner, this.api_key)
          .then((json) => {
            callback(undefined, json)
          })
          .catch((error) => {
            callback(error, undefined)
          })
      }
    } else {
      return new Promise((resolve, reject) => {
          if (!validated.region) reject(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST))
          else if (!validated.summoner) reject(new Error(errorMessages.INVALID_PARAM_SUMMONER_NAME, responseCodes.BAD_REQUEST))
          else resolve(parse.SummaryNormal(region, summoner, this.api_key))
      })
    }
  }

  Champions(region, summoner, season, callback) {
    let validated = {
      region: validate.Region(region),
      summoner: validate.Summoner(summoner),
      season: validate.Season(season)
    }

    if (typeof callback === 'function') {
      if (!validated.region) {
        callback(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST), undefined)
      } else if (!validated.summoner) {
        callback(new Error(errorMessages.INVALID_PARAM_SUMMONER_NAME, responseCodes.BAD_REQUEST), undefined)
      } else {
        parse.Champions(region, summoner, season, this.api_key)
          .then((json) => {
            callback(undefined, json)
          })
          .catch((error) => {
            callback(error, undefined)
          })
      }
    } else {
      return new Promise((resolve, reject) => {
          if (!validated.region) reject(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST))
          else if (!validated.summoner) reject(new Error(errorMessages.INVALID_PARAM_SUMMONER_NAME, responseCodes.BAD_REQUEST))
          else if (!validated.season) reject(new Error(errorMessages.INVALID_PARAM_SEASON, responseCodes.BAD_REQUEST))
          else resolve(parse.Champions(region, summoner, season, this.api_key))
      })
    }
  }

  League(region, summoner, callback) {
    let validated = {
      region: validate.Region(region),
      summoner: validate.Summoner(summoner)
    }

    if (typeof callback === 'function') {
      if (!validated.region) {
        callback(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST), undefined)
      } else if (!validated.summoner) {
        callback(new Error(errorMessages.INVALID_PARAM_SUMMONER_NAME, responseCodes.BAD_REQUEST), undefined)
      } else {
        parse.League(region, summoner, this.api_key)
          .then((json) => {
            callback(undefined, json)
          })
          .catch((error) => {
            callback(error, undefined)
          })
      }
    } else {
      return new Promise((resolve, reject) => {
          if (!validated.region) reject(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST))
          else if (!validated.summoner) reject(new Error(errorMessages.INVALID_PARAM_SUMMONER_NAME, responseCodes.BAD_REQUEST))
          else resolve(parse.League(region, summoner, this.api_key))
      })
    }
  }

  Runes(region, summoner, callback) {
    let validated = {
      region: validate.Region(region),
      summoner: validate.Summoner(summoner)
    }

    if (typeof callback === 'function') {
      if (!validated.region) {
        callback(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST), undefined)
      } else if (!validated.summoner) {
        callback(new Error(errorMessages.INVALID_PARAM_SUMMONER_NAME, responseCodes.BAD_REQUEST), undefined)
      } else {
        parse.Runes(region, summoner, this.api_key)
          .then((json) => {
            callback(undefined, json)
          })
          .catch((error) => {
            callback(error, undefined)
          })
      }
    } else {
      return new Promise((resolve, reject) => {
          if (!validated.region) reject(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST))
          else if (!validated.summoner) reject(new Error(errorMessages.INVALID_PARAM_SUMMONER_NAME, responseCodes.BAD_REQUEST))
          else resolve(parse.Runes(region, summoner, this.api_key))
      })
    }
  }

  Masteries(region, summoner, callback) {
    let validated = {
      region: validate.Region(region),
      summoner: validate.Summoner(summoner)
    }

    if (typeof callback === 'function') {
      if (!validated.region) {
        callback(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST), undefined)
        return
      } else if (!validated.summoner) {
        callback(new Error(errorMessages.INVALID_PARAM_SUMMONER_NAME, responseCodes.BAD_REQUEST), undefined)
        return
      } else {
        parse.Masteries(region, summoner, this.api_key)
          .then((json) => {
            callback(undefined, json)
          })
          .catch((error) => {
            callback(error, undefined)
          })
      }
    } else {
      return new Promise((resolve, reject) => {
          if (!validated.region) reject(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST))
          else if (!validated.summoner) reject(new Error(errorMessages.INVALID_PARAM_SUMMONER_NAME, responseCodes.BAD_REQUEST))
          else resolve(parse.Masteries(region, summoner, this.api_key))
      })
    }
  }

  Matches(region, summoner, start, callback) {
    let validated = {
      region: validate.Region(region),
      summoner: validate.Summoner(summoner),
      start: validate.Timestamp(start)
    }

    if (typeof callback === 'function') {
      if (!validated.region) {
        callback(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST), undefined)
      } else if (!validated.summoner) {
        callback(new Error(errorMessages.INVALID_PARAM_SUMMONER_NAME, responseCodes.BAD_REQUEST), undefined)
      } else if (!!start && !validated.start) {
        callback(new Error(errorMessages.INVALID_PARAM_TIMESTAMP, responseCodes.BAD_REQUEST), undefined)
      } else {
        if (!!start) {
          parse.Matches(region, summoner, this.api_key)
            .then((json) => {
              callback(undefined, json)
            })
            .catch((error) => {
              callback(error, undefined)
            })
        } else {
          parse.MatchesByTimestamp(region, summoner, start, this.api_key)
            .then((json) => {
              callback(undefined, json)
            })
            .catch((error) => {
              callback(error, undefined)
            })
        }
      }
    } else {
      return new Promise((resolve, reject) => {
          if (!validated.region) reject(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST))
          else if (!validated.summoner) reject(new Error(errorMessages.INVALID_PARAM_SUMMONER_NAME, responseCodes.BAD_REQUEST))
          else if (!!start && !validated.start) reject(new Error(errorMessages.INVALID_PARAM_TIMESTAMP, responseCodes.BAD_REQUEST))
          else {
            if (!!start) {
              resolve(parse.MatchesByTimestamp(region, summoner, start, this.api_key))
            } else {
              resolve(parse.Matches(region, summoner, this.api_key))
            }
          }
      })
    }
  }

  Match(region, gameId, summoner, callback) {
    let validated = {
      region: validate.Region(region),
      summoner: validate.Summoner(summoner),
      gameId: validate.GameId(gameId)
    }

    if (typeof callback === 'function') {
      if (!validated.region) {
        callback(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST), undefined)
      } else if (!validated.summoner) {
        callback(new Error(errorMessages.INVALID_PARAM_SUMMONER_NAME, responseCodes.BAD_REQUEST), undefined)
      } else if (!validated.gameId) {
        callback(new Error(errorMessages.INVALID_PARAM_GAME_ID, responseCodes.BAD_REQUEST), undefined)
      } else {
        parse.Match(region, summoner, gameId, this.api_key)
          .then((json) => {
            callback(undefined, json)
          })
          .catch((error) => {
            callback(error, undefined)
          })
      }
    } else {
      return new Promise((resolve, reject) => {
          if (!validated.region) reject(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST))
          else if (!validated.summoner) reject(new Error(errorMessages.INVALID_PARAM_SUMMONER_NAME, responseCodes.BAD_REQUEST))
          else if (!validated.gameId) reject(new Error(errorMessages.INVALID_PARAM_GAME_ID, responseCodes.BAD_REQUEST))
          else resolve(parse.Match(region, summoner, gameId, this.api_key))
      })
    }
  }

  Stats(region, type, league, period, mapId, queue, callback) {
    let validated = {
      region: validate.Region(region),
      type: validate.Summoner(summoner),
      league: !!league && validate.StatsLeague(league),
      period: !!period && validate.StatsPeriod(period),
      mapId: !!mapId && validate.StatsMap(map),
      queue: !!queue && validate.StatsQueueType(queue)
    }

    if (typeof callback === 'function') {
      if (!validated.region) {
        callback(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST), undefined)
      } else if (!validated.type) {
        callback(new Error(errorMessages.INVALID_PARAM_STATS_GRAPH_TYPE, responseCodes.BAD_REQUEST), undefined)
      } else if (!validated.league) {
        callback(new Error(errorMessages.INVALID_PARAM_STATS_LEAGUE, responseCodes.BAD_REQUEST), undefined)
      } else if (!validated.period) {
        callback(new Error(errorMessages.INVALID_PARAM_STATS_PERIOD, responseCodes.BAD_REQUEST), undefined)
      } else if (!validated.mapId) {
        callback(new Error(errorMessages.INVALID_PARAM_STATS_MAP, responseCodes.BAD_REQUEST), undefined)
      } else if (!validated.queue) {
        callback(new Error(errorMessages.INVALID_PARAM_STATS_QUEUE, responseCodes.BAD_REQUEST), undefined)
      } else {
        parse.Masteries(region, summoner, this.api_key)
          .then((json) => {
            callback(undefined, json)
          })
          .catch((error) => {
            callback(error, undefined)
          })
      }
    } else {
      return new Promise((resolve, reject) => {
          if (!validated.region) reject(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST))
          else if (!validated.type) reject(new Error(errorMessages.INVALID_PARAM_STATS_GRAPH_TYPE, responseCodes.BAD_REQUEST))
          else if (!validated.league) reject(new Error(errorMessages.INVALID_PARAM_STATS_LEAGUE, responseCodes.BAD_REQUEST))
          else if (!validated.period) reject(new Error(errorMessages.INVALID_PARAM_STATS_PERIOD, responseCodes.BAD_REQUEST))
          else if (!validated.mapId) reject(new Error(errorMessages.INVALID_PARAM_STATS_MAP, responseCodes.BAD_REQUEST))
          else if (!validated.queue) reject(new Error(errorMessages.INVALID_PARAM_STATS_QUEUE, responseCodes.BAD_REQUEST))
          else resolve(parse.Masteries(region, summoner, this.api_key))
      })
    }
  }

  Analytics(region, callback) {
    let validated = validate.Region(region)

    if (typeof callback === 'function') {
      if (!validated) {
        callback(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST), undefined)
      } else {
        parse.Analytics(region, this.api_key)
          .then((json) => {
            callback(undefined, json)
          })
          .catch((error) => {
            callback(error, undefined)
          })
      }
    } else {
      return new Promise((resolve, reject) => {
          if (!validated) reject(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST))
          else resolve(parse.Analytics(region, this.api_key))
      })
    }
  }

  AnalyticsByChampion(region, champion, role, callback) {
    let validated = {
        region: validate.Region(region),
        champion: validate.ChampionName(champion),
        role: validate.Role(role)
      }

    if (typeof callback === 'function') {
        if (!validated.region) {
          callback(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST), undefined)
        } else if (!validated.champion) {
          callback(new Error(errorMessages.INVALID_PARAM_CHAMPION_NAME, responseCodes.BAD_REQUEST), undefined)
        } else if (!validated.role) {
          callback(new Error(errorMessages.INVALID_PARAM_ROLE, responseCodes.BAD_REQUEST), undefined)
        } else {
          parse.AnalyticsByChampion(region, champion, role, this.api_key)
            .then((json) => {
              callback(undefined, json)
            })
            .catch((error) => {
              callback(error, undefined)
            })
        }
    } else {
        return new Promise((resolve, reject) => {
            if (!validated.region) reject(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST))
            else if (!validated.champion) reject(new Error(errorMessages.INVALID_CHAMPION_NAME, responseCodes.BAD_REQUEST))
            else if (!validated.role) reject(new Error(errorMessages.INVALID_PARAM_ROLE, responseCodes.BAD_REQUEST))
            else resolve(parse.AnalyticsByChampion(region, champion, role, this.api_key))
        })
    }
  }

  AnalyticsByChampionItems(region, champion, role, callback) {
    let validated = {
        region: validate.Region(region),
        champion: validate.ChampionName(champion),
        role: validate.Role(role)
      }

    if (typeof callback === 'function') {
        if (!validated.region) {
          callback(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST), undefined)
        } else if (!validated.champion) {
          callback(new Error(errorMessages.INVALID_PARAM_CHAMPION_NAME, responseCodes.BAD_REQUEST), undefined)
        } else if (!validated.role) {
          callback(new Error(errorMessages.INVALID_PARAM_ROLE, responseCodes.BAD_REQUEST), undefined)
        } else {
          parse.AnalyticsByChampionItems(region, champion, role, this.api_key)
            .then((json) => {
              callback(undefined, json)
            })
            .catch((error) => {
              callback(error, undefined)
            })
        }
    } else {
        return new Promise((resolve, reject) => {
            if (!validated.region) reject(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST))
            else if (!validated.champion) reject(new Error(errorMessages.INVALID_CHAMPION_NAME, responseCodes.BAD_REQUEST))
            else if (!validated.role) reject(new Error(errorMessages.INVALID_PARAM_ROLE, responseCodes.BAD_REQUEST))
            else resolve(parse.AnalyticsByChampionItems(region, champion, role, this.api_key))
        })
    }
  }

  AnalyticsByChampionSkills(region, champion, role, callback) {
    let validated = {
        region: validate.Region(region),
        champion: validate.ChampionName(champion),
        role: validate.Role(role)
      }

    if (typeof callback === 'function') {
        if (!validated.region) {
          callback(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST), undefined)
        } else if (!validated.champion) {
          callback(new Error(errorMessages.INVALID_PARAM_CHAMPION_NAME, responseCodes.BAD_REQUEST), undefined)
        } else if (!validated.role) {
          callback(new Error(errorMessages.INVALID_PARAM_ROLE, responseCodes.BAD_REQUEST), undefined)
        } else {
          parse.AnalyticsByChampionSkills(region, champion, role, this.api_key)
            .then((json) => {
              callback(undefined, json)
            })
            .catch((error) => {
              callback(error, undefined)
            })
        }
    } else {
        return new Promise((resolve, reject) => {
            if (!validated.region) reject(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST))
            else if (!validated.champion) reject(new Error(errorMessages.INVALID_CHAMPION_NAME, responseCodes.BAD_REQUEST))
            else if (!validated.role) reject(new Error(errorMessages.INVALID_PARAM_ROLE, responseCodes.BAD_REQUEST))
            else resolve(parse.AnalyticsByChampionSkills(region, champion, role, this.api_key))
        })
    }
  }

  AnalyticsByChampionRunes(region, champion, role, callback) {
    let validated = {
        region: validate.Region(region),
        champion: validate.ChampionName(champion),
        role: validate.Role(role)
      }

    if (typeof callback === 'function') {
        if (!validated.region) {
          callback(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST), undefined)
        } else if (!validated.champion) {
          callback(new Error(errorMessages.INVALID_PARAM_CHAMPION_NAME, responseCodes.BAD_REQUEST), undefined)
        } else if (!validated.role) {
          callback(new Error(errorMessages.INVALID_PARAM_ROLE, responseCodes.BAD_REQUEST), undefined)
        } else {
          parse.AnalyticsByChampionRunes(region, champion, role, this.api_key)
            .then((json) => {
              callback(undefined, json)
            })
            .catch((error) => {
              callback(error, undefined)
            })
        }
    } else {
        return new Promise((resolve, reject) => {
            if (!validated.region) reject(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST))
            else if (!validated.champion) reject(new Error(errorMessages.INVALID_CHAMPION_NAME, responseCodes.BAD_REQUEST))
            else if (!validated.role) reject(new Error(errorMessages.INVALID_PARAM_ROLE, responseCodes.BAD_REQUEST))
            else resolve(parse.AnalyticsByChampionRunes(region, champion, role, this.api_key))
        })
    }
  }

  AnalyticsByChampionMasteries(region, champion, role, callback) {
    let validated = {
        region: validate.Region(region),
        champion: validate.ChampionName(champion),
        role: validate.Role(role)
      }

    if (typeof callback === 'function') {
        if (!validated.region) {
          callback(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST), undefined)
        } else if (!validated.champion) {
          callback(new Error(errorMessages.INVALID_PARAM_CHAMPION_NAME, responseCodes.BAD_REQUEST), undefined)
        } else if (!validated.role) {
          callback(new Error(errorMessages.INVALID_PARAM_ROLE, responseCodes.BAD_REQUEST), undefined)
        } else {
          parse.AnalyticsByChampionMasteries(region, champion, role, this.api_key)
            .then((json) => {
              callback(undefined, json)
            })
            .catch((error) => {
              callback(error, undefined)
            })
        }
    } else {
        return new Promise((resolve, reject) => {
            if (!validated.region) reject(new Error(errorMessages.INVALID_PARAM_REGION, responseCodes.BAD_REQUEST))
            else if (!validated.champion) reject(new Error(errorMessages.INVALID_CHAMPION_NAME, responseCodes.BAD_REQUEST))
            else if (!validated.role) reject(new Error(errorMessages.INVALID_PARAM_ROLE, responseCodes.BAD_REQUEST))
            else resolve(parse.AnalyticsByChampionMasteries(region, champion, role, this.api_key))
        })
    }
  }
}