'use strict'
var Endpoint = require('./Endpoint'),
    cheerio = require('cheerio'),
    Error = require('../Responses/Error'),
    errorMessages = require('../Responses/error_messages.json'),
    responseCodes = require('../Responses/response_codes.json')

module.exports = class SummonerStatsEndpoint extends Endpoint {
    Path() {
        return '/summoner/'
    }

    Parse($, json) {
        let data = {};

        data.summonerId = $('#SummonerRefreshButton').attr('onclick');
        var regex = new RegExp(/this, '(\d*)'\)/g);
        regex = regex.exec(data.summonerId);
        data.summonerId = !!regex && regex.length ? parseInt(regex[1]) : undefined;

        data.lp = parseInt($('.TierRankInfo .LeaguePoints').text().replace(' LP', ''));
        if (!data.lp) data.lp = undefined;

        data.wins = parseInt($('.WinLose .wins').text().replace('W', ''));
        if (!data.wins) data.wins = undefined;
        data.losses = parseInt($('.WinLose .losses').text().replace('L', ''));
        if (!data.losses) data.losses = undefined;
        data.winRatio = parseInt($('.WinLose .winratio').text().replace('%', '').replace('Win Ratio ', ''));
        if (!data.winRatio) data.winRatio = undefined;

        return data;
    }
}