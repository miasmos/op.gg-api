const Error = require("./responses/Error"),
    errorMessages = require("./responses/error_messages.json"),
    responseCodes = require("./responses/response_codes.json"),
    riot = require("./api/riot"),
    LiveEndpoint = new (require("./parser/live"))(),
    RenewEndpoint = new (require("./RenewEndpoint"))(),
    SummonerStatsEndpoint = new (require("./SummonerStatsEndpoint"))(),
    SummaryCombinedEndpoint = new (require("./SummaryCombinedEndpoint"))(),
    SummaryRankedEndpoint = new (require("./SummaryRankedEndpoint"))(),
    SummaryNormalEndpoint = new (require("./SummaryNormalEndpoint"))(),
    ChampionsEndpoint = new (require("./parser/champions"))(),
    LeaguesEndpoint = new (require("./LeaguesEndpoint"))(),
    MatchesEndpoint = new (require("./MatchesEndpoint"))(),
    MatchEndpoint = new (require("./MatchEndpoint"))(),
    RunesEndpoint = new (require("./RunesEndpoint"))(),
    MasteriesEndpoint = new (require("./MasteriesEndpoint"))(),
    MatchesByTimestampEndpoint = new (require("./MatchesByTimestampEndpoint"))(),
    StatsEndpoint = new (require("./StatsEndpoint"))(),
    AnalyticsEndpoint = new (require("./parser/analytics"))(),
    AnalyticsByChampionEndpoint = new (require("./parser/analyticsByChampion"))(),
    AnalyticsByChampionItemsEndpoint = new (require("./parser/analyticsByChampionItems"))(),
    AnalyticsByChampionSkillsEndpoint = new (require("./parser/analyticsByChampionsSkills"))(),
    AnalyticsByChampionRunesEndpoint = new (require("./parser/analyticsByChampionRunes"))(),
    AnalyticsByChampionMasteriesEndpoint = new (require("./parser/analyticsByChampionMasteries"))();

class Parser {
    constructor() {
        this.apiList = {};
        this.summonerIds = {};
    }

    live(region, key) {
        if (!!key) this.spawnAPI(key);

        return new Promise((resolve, reject) => {
            LiveEndpoint.request({ region })
                .then(response => {
                    if (response instanceof Error) {
                        reject(response);
                        return;
                    }

                    if (!!key) {
                        this.apiList[key]
                            .champions()
                            .then(champions => {
                                if (!!champions) {
                                    response = response.map(item => {
                                        let champKey = item.champion.name.replace(/\s/g, "");
                                        if (champKey in champions) {
                                            item.champion.id =
                                                "id" in champions[champKey]
                                                    ? champions[champKey].id
                                                    : undefined;
                                            item.champion.title =
                                                "title" in champions[champKey]
                                                    ? champions[champKey].title
                                                    : undefined;
                                        }
                                        return item;
                                    });
                                }
                                resolve(response);
                            })
                            .catch(error => {
                                reject(error);
                            });
                    } else {
                        resolve(response);
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    renew(region, summonerId) {
        return new Promise((resolve, reject) => {
            RenewEndpoint.request({ region, summonerId })
                .then(response => {
                    if (response instanceof Error) {
                        reject(response);
                    } else {
                        resolve(response);
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    summonerStats(region, userName) {
        return new Promise((resolve, reject) => {
            SummonerStatsEndpoint.request({ region, userName })
                .then(response => {
                    if (response instanceof Error) {
                        reject(response);
                    } else {
                        this.saveId(region, userName, response.summonerId);
                        resolve(response);
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    summaryCombined(region, userName) {
        return new Promise((resolve, reject) => {
            SummaryCombinedEndpoint.request({ region, userName })
                .then(response => {
                    if (response instanceof Error) {
                        reject(response);
                    } else {
                        this.saveId(region, userName, response.summonerId);
                        resolve(response);
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    summaryRanked(region, userName) {
        return new Promise((resolve, reject) => {
            this.summaryCombined(region, userName)
                .then(response => {
                    if ("summonerId" in response) {
                        SummaryRankedEndpoint.request({ region, summonerId: response.summonerId })
                            .then(response1 => {
                                if (response1 instanceof Error) {
                                    reject(response1);
                                } else {
                                    response.games = response1;
                                    this.saveId(region, userName, response.summonerId);
                                    resolve(response);
                                }
                            })
                            .catch(error => {
                                reject(error);
                            });
                    } else {
                        reject(new Error(errorMessages.EMPTY_RESPONSE, responseCodes.ERROR));
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    summaryNormal(region, userName) {
        return new Promise((resolve, reject) => {
            this.summaryCombined(region, userName)
                .then(response => {
                    if ("summonerId" in response) {
                        SummaryNormalEndpoint.request({ region, summonerId: response.summonerId })
                            .then(response1 => {
                                if (response1 instanceof Error) {
                                    reject(response1);
                                } else {
                                    response.games = response1;
                                    this.saveId(region, userName, response.summonerId);
                                    resolve(response);
                                }
                            })
                            .catch(error => {
                                reject(error);
                            });
                    } else {
                        reject(new Error(errorMessages.EMPTY_RESPONSE, responseCodes.ERROR));
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    champions(region, userName, season) {
        return new Promise((resolve, reject) => {
            if (this.getId(region, userName)) {
                ChampionsEndpoint.request({
                    region,
                    season,
                    summonerId: this.getId(region, userName),
                })
                    .then(response1 => {
                        if (response1 instanceof Error) {
                            reject(response1);
                        } else {
                            resolve(response1);
                        }
                    })
                    .catch(error => {
                        reject(error);
                    });
            } else {
                this.summaryCombined(region, userName)
                    .then(response => {
                        if ("summonerId" in response) {
                            ChampionsEndpoint.request({
                                region,
                                season,
                                summonerId: response.summonerId,
                            })
                                .then(response1 => {
                                    if (response1 instanceof Error) {
                                        reject(response1);
                                    } else {
                                        this.saveId(region, userName, response.summonerId);
                                        resolve(response1);
                                    }
                                })
                                .catch(error => {
                                    reject(error);
                                });
                        } else {
                            reject(new Error(errorMessages.EMPTY_RESPONSE, responseCodes.ERROR));
                        }
                    })
                    .catch(error => {
                        reject(error);
                    });
            }
        });
    }

    match(region, userName, gameId) {
        return new Promise((resolve, reject) => {
            if (this.getId(region, userName)) {
                MatchEndpoint.request({ region, gameId, summonerId: this.getId(region, userName) })
                    .then(response1 => {
                        if (response1 instanceof Error) {
                            reject(response1);
                        } else {
                            resolve(response1);
                        }
                    })
                    .catch(error => {
                        reject(error);
                    });
            } else {
                this.summaryCombined(region, userName)
                    .then(response => {
                        if ("summonerId" in response) {
                            MatchEndpoint.request({
                                region,
                                gameId,
                                summonerId: response.summonerId,
                            })
                                .then(response1 => {
                                    if (response1 instanceof Error) {
                                        reject(response1);
                                    } else {
                                        this.SaveId(region, userName, response.summonerId);
                                        resolve(response1);
                                    }
                                })
                                .catch(error => {
                                    reject(error);
                                });
                        } else {
                            reject(new Error(errorMessages.EMPTY_RESPONSE, responseCodes.ERROR));
                        }
                    })
                    .catch(error => {
                        reject(error);
                    });
            }
        });
    }

    league(region, userName) {
        return new Promise((resolve, reject) => {
            LeaguesEndpoint.request({ region, userName })
                .then(response => {
                    if (response instanceof Error) {
                        reject(response);
                    } else {
                        resolve(response);
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    matches(region, userName) {
        return new Promise((resolve, reject) => {
            MatchesEndpoint.request({ region, userName })
                .then(response => {
                    if (response instanceof Error) {
                        reject(response);
                    } else {
                        resolve(response);
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    runes(region, userName) {
        return new Promise((resolve, reject) => {
            RunesEndpoint.request({ region, userName })
                .then(response => {
                    if (response instanceof Error) {
                        reject(response);
                    } else {
                        resolve(response);
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    masteries(region, userName) {
        return new Promise((resolve, reject) => {
            MasteriesEndpoint.request({ region, userName })
                .then(response => {
                    if (response instanceof Error) {
                        reject(response);
                    } else {
                        resolve(response);
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    matchesByTimestamp(region, userName, startInfo) {
        return new Promise((resolve, reject) => {
            if (this.getId(region, userName)) {
                MatchesByTimestampEndpoint.request({
                    region,
                    startInfo,
                    summonerId: this.getId(region, userName),
                })
                    .then(response1 => {
                        if (response1 instanceof Error) {
                            reject(response1);
                        } else {
                            resolve(response1);
                        }
                    })
                    .catch(error => {
                        reject(error);
                    });
            } else {
                this.summaryCombined(region, userName)
                    .then(response => {
                        if ("summonerId" in response) {
                            MatchesByTimestampEndpoint.request({
                                region,
                                startInfo,
                                summonerId: response.summonerId,
                            })
                                .then(response1 => {
                                    if (response1 instanceof Error) {
                                        reject(response1);
                                    } else {
                                        this.SaveId(region, userName, response.summonerId);
                                        resolve(response1);
                                    }
                                })
                                .catch(error => {
                                    reject(error);
                                });
                        } else {
                            reject(new Error(errorMessages.EMPTY_RESPONSE, responseCodes.ERROR));
                        }
                    })
                    .catch(error => {
                        reject(error);
                    });
            }
        });
    }

    stats(region, type, league, period, mapId, queue) {
        return new Promise((resolve, reject) => {
            StatsEndpoint.request({ region, type, league, period, mapId, queue })
                .then(response => {
                    if (response instanceof Error) {
                        reject(response);
                    } else {
                        resolve(response);
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    analytics(region) {
        return new Promise((resolve, reject) => {
            AnalyticsEndpoint.request({ region })
                .then(response => {
                    if (response instanceof Error) {
                        reject(response);
                    } else {
                        resolve(response);
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    analyticsByChampion(region, champion, role) {
        return new Promise((resolve, reject) => {
            AnalyticsByChampionEndpoint.request({ region, champion, role })
                .then(response => {
                    if (response instanceof Error) {
                        reject(response);
                    } else {
                        resolve(response);
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    analyticsByChampionItems(region, champion, role) {
        return new Promise((resolve, reject) => {
            AnalyticsByChampionItemsEndpoint.request({ region, champion, role })
                .then(response => {
                    if (response instanceof Error) {
                        reject(response);
                    } else {
                        resolve(response);
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    analyticsByChampionSkills(region, champion, role) {
        return new Promise((resolve, reject) => {
            AnalyticsByChampionSkillsEndpoint.request({ region, champion, role })
                .then(response => {
                    if (response instanceof Error) {
                        reject(response);
                    } else {
                        resolve(response);
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    analyticsByChampionRunes(region, champion, role) {
        return new Promise((resolve, reject) => {
            AnalyticsByChampionRunesEndpoint.request({ region, champion, role })
                .then(response => {
                    if (response instanceof Error) {
                        reject(response);
                    } else {
                        resolve(response);
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    analyticsByChampionMasteries(region, champion, role) {
        return new Promise((resolve, reject) => {
            AnalyticsByChampionMasteriesEndpoint.request({ region, champion, role })
                .then(response => {
                    if (response instanceof Error) {
                        reject(response);
                    } else {
                        resolve(response);
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    spawnAPI(key) {
        //spawns a new api if it doesn't already exist, indexed by api key
        if (!(key in this.apiList)) {
            this.apiList[key] = new riot({ key: key });
        }
    }

    saveId(region, userName, summonerId) {
        if (!region || !userName || !summonerId) return;
        if (!(region in this.summonerIds)) this.summonerIds[region] = {};
        this.summonerIds[region][userName] = summonerId;
    }

    getId(region, userName) {
        if (!(region in this.summonerIds) || !(userName in this.summonerIds[region])) return false;
        return this.summonerIds[region][userName];
    }
}

module.exports = new Parser();
