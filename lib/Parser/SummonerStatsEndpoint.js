'use strict'
var Endpoint = require('./Endpoint'),
    cheerio = require('cheerio'),
    Error = require('../Responses/Error'),
    errorMessages = require('../Responses/error_messages.json'),
    responseCodes = require('../Responses/response_codes.json')

const StreakType = Object.freeze({
    WIN_STREAK: "WIN_STREAK",
    LOSS_STREAK: "LOSS_STREAK"
});


module.exports = class SummonerStatsEndpoint extends Endpoint {
    Path() {
        return '/summoner/'
    }

    Parse($, json) {
        let data = {};

        data.summonerName = $('span.Name').text();

        data.summonerId = $('#SummonerRefreshButton').attr('onclick');
        var regex = new RegExp(/this, '(\d*)'\)/g);
        regex = regex.exec(data.summonerId);
        data.summonerId = !!regex && regex.length ? parseInt(regex[1]) : undefined;

        data.lp = parseInt($('.TierRankInfo .LeaguePoints').text().replace(' LP', ''));
        if (!data.lp) data.lp = undefined;

        // nr. of wins, losses, and wr%
        data.wins = parseInt($('.WinLose .wins').text().replace('W', ''));
        if (!data.wins) data.wins = undefined;
        data.losses = parseInt($('.WinLose .losses').text().replace('L', ''));
        if (!data.losses) data.losses = undefined;
        data.winRatio = parseInt($('.WinLose .winratio').text().replace('%', '').replace('Win Ratio ', ''));
        if (!data.winRatio) data.winRatio = undefined;

        // Get result from each recently played game
        let firstGameResult = undefined;
        let streakType = undefined; // win- or loss-streak
        let streak = 0;
        let ongoingStreak = true;
        $('.GameItemWrap').each((i, game) => {
            if (!ongoingStreak) return;

            var $ = cheerio.load(game);

            const gameResult = this.Strip($('.GameResult').text());
            if (!streakType) {
                firstGameResult = gameResult;
                streakType = (gameResult === "Victory" ? StreakType.WIN_STREAK : StreakType.LOSS_STREAK);
            }

            if (gameResult === firstGameResult) {
                streak++;
            } else {
                ongoingStreak = false;
            }
        });

        data.streakType = streakType;
        if (streakType === StreakType.WIN_STREAK) {
            data.winStreak = streak;
        } else {
            data.lossStreak = streak;
        }

        return data;
    }
}