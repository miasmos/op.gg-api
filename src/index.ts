import ParserFactory from "./parser/factory";
import Riot from "./api/riot";
import { Region } from "./enum";
import SummonerIdCache from "./summonerIdCache";
import { LiveResponse } from "./types";

class Opgg {
    summonerIds = new SummonerIdCache();
    api = new Riot();

    async live(region: Region): Promise<LiveResponse> {
        const parser = ParserFactory.live();
        const response = await parser.request({ region });
        const champions = await this.api.champions();
        return response.map(({ name, ...champion }) => {
            const key = name.replace(/\s/g, "");
            let id: string;
            let title: string;
            if (key in champions) {
                if ("id" in champions[key]) {
                    id = champions[key].id;
                }
                if ("title" in champions[key]) {
                    title = champions[key].title;
                }
            }
            return { name, ...champion, id, title };
        });
    }

    // renew(region, summonerId) {
    //     return new Promise((resolve, reject) => {
    //         Renew.request({ region, summonerId })
    //             .then(response => {
    //                 if (response instanceof Error) {
    //                     reject(response);
    //                 } else {
    //                     resolve(response);
    //                 }
    //             })
    //             .catch(error => {
    //                 reject(error);
    //             });
    //     });
    // }
    // summonerStats(region, userName) {
    //     return new Promise((resolve, reject) => {
    //         SummonerStats.request({ region, userName })
    //             .then(response => {
    //                 if (response instanceof Error) {
    //                     reject(response);
    //                 } else {
    //                     this.saveId(region, userName, response.summonerId);
    //                     resolve(response);
    //                 }
    //             })
    //             .catch(error => {
    //                 reject(error);
    //             });
    //     });
    // }
    // summaryCombined(region, userName) {
    //     return new Promise((resolve, reject) => {
    //         SummaryCombined.request({ region, userName })
    //             .then(response => {
    //                 if (response instanceof Error) {
    //                     reject(response);
    //                 } else {
    //                     this.saveId(region, userName, response.summonerId);
    //                     resolve(response);
    //                 }
    //             })
    //             .catch(error => {
    //                 reject(error);
    //             });
    //     });
    // }
    // summaryRanked(region, userName) {
    //     return new Promise((resolve, reject) => {
    //         this.summaryCombined(region, userName)
    //             .then(response => {
    //                 if ("summonerId" in response) {
    //                     SummaryRanked.request({ region, summonerId: response.summonerId })
    //                         .then(response1 => {
    //                             if (response1 instanceof Error) {
    //                                 reject(response1);
    //                             } else {
    //                                 response.games = response1;
    //                                 this.saveId(region, userName, response.summonerId);
    //                                 resolve(response);
    //                             }
    //                         })
    //                         .catch(error => {
    //                             reject(error);
    //                         });
    //                 } else {
    //                     reject(new Error(errorMessages.EMPTY_RESPONSE, responseCodes.ERROR));
    //                 }
    //             })
    //             .catch(error => {
    //                 reject(error);
    //             });
    //     });
    // }
    // summaryNormal(region, userName) {
    //     return new Promise((resolve, reject) => {
    //         this.summaryCombined(region, userName)
    //             .then(response => {
    //                 if ("summonerId" in response) {
    //                     SummaryNormal.request({ region, summonerId: response.summonerId })
    //                         .then(response1 => {
    //                             if (response1 instanceof Error) {
    //                                 reject(response1);
    //                             } else {
    //                                 response.games = response1;
    //                                 this.saveId(region, userName, response.summonerId);
    //                                 resolve(response);
    //                             }
    //                         })
    //                         .catch(error => {
    //                             reject(error);
    //                         });
    //                 } else {
    //                     reject(new Error(errorMessages.EMPTY_RESPONSE, responseCodes.ERROR));
    //                 }
    //             })
    //             .catch(error => {
    //                 reject(error);
    //             });
    //     });
    // }
    // champions(region, userName, season) {
    //     return new Promise((resolve, reject) => {
    //         if (this.getId(region, userName)) {
    //             Champions.request({
    //                 region,
    //                 season,
    //                 summonerId: this.getId(region, userName),
    //             })
    //                 .then(response1 => {
    //                     if (response1 instanceof Error) {
    //                         reject(response1);
    //                     } else {
    //                         resolve(response1);
    //                     }
    //                 })
    //                 .catch(error => {
    //                     reject(error);
    //                 });
    //         } else {
    //             this.summaryCombined(region, userName)
    //                 .then(response => {
    //                     if ("summonerId" in response) {
    //                         Champions.request({
    //                             region,
    //                             season,
    //                             summonerId: response.summonerId,
    //                         })
    //                             .then(response1 => {
    //                                 if (response1 instanceof Error) {
    //                                     reject(response1);
    //                                 } else {
    //                                     this.saveId(region, userName, response.summonerId);
    //                                     resolve(response1);
    //                                 }
    //                             })
    //                             .catch(error => {
    //                                 reject(error);
    //                             });
    //                     } else {
    //                         reject(new Error(errorMessages.EMPTY_RESPONSE, responseCodes.ERROR));
    //                     }
    //                 })
    //                 .catch(error => {
    //                     reject(error);
    //                 });
    //         }
    //     });
    // }
    // match(region, userName, gameId) {
    //     return new Promise((resolve, reject) => {
    //         if (this.getId(region, userName)) {
    //             Match.request({ region, gameId, summonerId: this.getId(region, userName) })
    //                 .then(response1 => {
    //                     if (response1 instanceof Error) {
    //                         reject(response1);
    //                     } else {
    //                         resolve(response1);
    //                     }
    //                 })
    //                 .catch(error => {
    //                     reject(error);
    //                 });
    //         } else {
    //             this.summaryCombined(region, userName)
    //                 .then(response => {
    //                     if ("summonerId" in response) {
    //                         Match.request({
    //                             region,
    //                             gameId,
    //                             summonerId: response.summonerId,
    //                         })
    //                             .then(response1 => {
    //                                 if (response1 instanceof Error) {
    //                                     reject(response1);
    //                                 } else {
    //                                     this.SaveId(region, userName, response.summonerId);
    //                                     resolve(response1);
    //                                 }
    //                             })
    //                             .catch(error => {
    //                                 reject(error);
    //                             });
    //                     } else {
    //                         reject(new Error(errorMessages.EMPTY_RESPONSE, responseCodes.ERROR));
    //                     }
    //                 })
    //                 .catch(error => {
    //                     reject(error);
    //                 });
    //         }
    //     });
    // }
    // league(region, userName) {
    //     return new Promise((resolve, reject) => {
    //         Leagues.request({ region, userName })
    //             .then(response => {
    //                 if (response instanceof Error) {
    //                     reject(response);
    //                 } else {
    //                     resolve(response);
    //                 }
    //             })
    //             .catch(error => {
    //                 reject(error);
    //             });
    //     });
    // }
    // matches(region, userName) {
    //     return new Promise((resolve, reject) => {
    //         Matches.request({ region, userName })
    //             .then(response => {
    //                 if (response instanceof Error) {
    //                     reject(response);
    //                 } else {
    //                     resolve(response);
    //                 }
    //             })
    //             .catch(error => {
    //                 reject(error);
    //             });
    //     });
    // }
    // runes(region, userName) {
    //     return new Promise((resolve, reject) => {
    //         Runes.request({ region, userName })
    //             .then(response => {
    //                 if (response instanceof Error) {
    //                     reject(response);
    //                 } else {
    //                     resolve(response);
    //                 }
    //             })
    //             .catch(error => {
    //                 reject(error);
    //             });
    //     });
    // }
    // masteries(region, userName) {
    //     return new Promise((resolve, reject) => {
    //         Masteries.request({ region, userName })
    //             .then(response => {
    //                 if (response instanceof Error) {
    //                     reject(response);
    //                 } else {
    //                     resolve(response);
    //                 }
    //             })
    //             .catch(error => {
    //                 reject(error);
    //             });
    //     });
    // }
    // matchesByTimestamp(region, userName, startInfo) {
    //     return new Promise((resolve, reject) => {
    //         if (this.getId(region, userName)) {
    //             MatchesByTimestamp.request({
    //                 region,
    //                 startInfo,
    //                 summonerId: this.getId(region, userName),
    //             })
    //                 .then(response1 => {
    //                     if (response1 instanceof Error) {
    //                         reject(response1);
    //                     } else {
    //                         resolve(response1);
    //                     }
    //                 })
    //                 .catch(error => {
    //                     reject(error);
    //                 });
    //         } else {
    //             this.summaryCombined(region, userName)
    //                 .then(response => {
    //                     if ("summonerId" in response) {
    //                         MatchesByTimestamp.request({
    //                             region,
    //                             startInfo,
    //                             summonerId: response.summonerId,
    //                         })
    //                             .then(response1 => {
    //                                 if (response1 instanceof Error) {
    //                                     reject(response1);
    //                                 } else {
    //                                     this.SaveId(region, userName, response.summonerId);
    //                                     resolve(response1);
    //                                 }
    //                             })
    //                             .catch(error => {
    //                                 reject(error);
    //                             });
    //                     } else {
    //                         reject(new Error(errorMessages.EMPTY_RESPONSE, responseCodes.ERROR));
    //                     }
    //                 })
    //                 .catch(error => {
    //                     reject(error);
    //                 });
    //         }
    //     });
    // }
    // stats(region, type, league, period, mapId, queue) {
    //     return new Promise((resolve, reject) => {
    //         Stats.request({ region, type, league, period, mapId, queue })
    //             .then(response => {
    //                 if (response instanceof Error) {
    //                     reject(response);
    //                 } else {
    //                     resolve(response);
    //                 }
    //             })
    //             .catch(error => {
    //                 reject(error);
    //             });
    //     });
    // }
    // analytics(region) {
    //     return new Promise((resolve, reject) => {
    //         Analytics.request({ region })
    //             .then(response => {
    //                 if (response instanceof Error) {
    //                     reject(response);
    //                 } else {
    //                     resolve(response);
    //                 }
    //             })
    //             .catch(error => {
    //                 reject(error);
    //             });
    //     });
    // }
    // analyticsByChampion(region, champion, role) {
    //     return new Promise((resolve, reject) => {
    //         AnalyticsByChampion.request({ region, champion, role })
    //             .then(response => {
    //                 if (response instanceof Error) {
    //                     reject(response);
    //                 } else {
    //                     resolve(response);
    //                 }
    //             })
    //             .catch(error => {
    //                 reject(error);
    //             });
    //     });
    // }
    // analyticsByChampionItems(region, champion, role) {
    //     return new Promise((resolve, reject) => {
    //         AnalyticsByChampionItems.request({ region, champion, role })
    //             .then(response => {
    //                 if (response instanceof Error) {
    //                     reject(response);
    //                 } else {
    //                     resolve(response);
    //                 }
    //             })
    //             .catch(error => {
    //                 reject(error);
    //             });
    //     });
    // }
    // analyticsByChampionSkills(region, champion, role) {
    //     return new Promise((resolve, reject) => {
    //         AnalyticsByChampionSkills.request({ region, champion, role })
    //             .then(response => {
    //                 if (response instanceof Error) {
    //                     reject(response);
    //                 } else {
    //                     resolve(response);
    //                 }
    //             })
    //             .catch(error => {
    //                 reject(error);
    //             });
    //     });
    // }
    // analyticsByChampionRunes(region, champion, role) {
    //     return new Promise((resolve, reject) => {
    //         AnalyticsByChampionRunes.request({ region, champion, role })
    //             .then(response => {
    //                 if (response instanceof Error) {
    //                     reject(response);
    //                 } else {
    //                     resolve(response);
    //                 }
    //             })
    //             .catch(error => {
    //                 reject(error);
    //             });
    //     });
    // }
    // analyticsByChampionMasteries(region, champion, role) {
    //     return new Promise((resolve, reject) => {
    //         AnalyticsByChampionMasteries.request({ region, champion, role })
    //             .then(response => {
    //                 if (response instanceof Error) {
    //                     reject(response);
    //                 } else {
    //                     resolve(response);
    //                 }
    //             })
    //             .catch(error => {
    //                 reject(error);
    //             });
    //     });
    // }
}

export default Opgg;
