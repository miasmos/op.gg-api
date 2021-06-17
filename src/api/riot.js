"use strict";
var api = require("leagueapi"),
    Promise = require("bluebird"),
    errorMessages = require("../lib/Responses/error_messages.json"),
    responseCodes = require("../lib/Responses/response_codes.json"),
    Error = require("../lib/responses/error");

class Riot {
    constructor(opts) {
        if (!opts) opts = {};
        this.key = !!opts.key ? opts.key : undefined;
        if (!this.key) throw new Error(errorMessages.API_KEY_MISSING, responseCodes.BAD_REQUEST);
        this.cache = {};
        api.init(this.key);
    }

    Champions() {
        return new Promise((resolve, reject) => {
            if ("ChampionList" in this.cache) {
                resolve(this.cache["ChampionList"]);
            } else {
                api.Static.getChampionList({}, (message, champions) => {
                    if (!!message) reject(this.GenerateError(message));
                    else {
                        this.cache["ChampionList"] = champions.data;
                        resolve(champions.data);
                    }
                });
            }
        });
    }

    GenerateError(message) {
        return new Error(`${errorMessages.RIOT_API_ERROR} (${message})`, responseCodes.BAD_REQUEST);
    }
}

module.exports = Riot;
