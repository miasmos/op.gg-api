import cheerio from "cheerio";
import Endpoint from "./endpoint";

const StreakType = Object.freeze({
    WIN_STREAK: "WIN_STREAK",
    LOSS_STREAK: "LOSS_STREAK",
});

const isEmptyObject = object => {
    return object && Object.keys(object).length === 0 && object.constructor === Object;
};

class SummonerStats extends Endpoint {
    path() {
        return "/summoner/";
    }

    parse($, json) {
        let data = {};

        data.summonerName = $("span.Name").text();

        data.summonerId = $("#SummonerRefreshButton").attr("onclick");
        var regex = new RegExp(/this, '(\d*)'\)/g);
        regex = regex.exec(data.summonerId);
        data.summonerId = !!regex && regex.length ? parseInt(regex[1]) : undefined;

        data.lp = parseInt($(".TierRankInfo .LeaguePoints").text().replace(" LP", ""));
        if (!data.lp) data.lp = undefined;

        // Nr. of wins, losses, and wr%
        data.wins = parseInt($(".WinLose .wins").text().replace("W", ""));
        data.losses = parseInt($(".WinLose .losses").text().replace("L", ""));
        data.winRatio = parseInt(
            $(".WinLose .winratio").text().replace("%", "").replace("Win Ratio ", "")
        );
        data.gameCount = data.wins + data.losses;

        // Get result from each recently played game to determine current win- or loss-streak
        let firstGameResult = undefined;
        let streakType = undefined; // win- or loss-streak
        let streak = 0;
        let ongoingStreak = true;
        $(".GameItemWrap").each((i, game) => {
            if (!ongoingStreak) return;

            var $ = cheerio.load(game);

            const gameResult = this.Strip($(".GameResult").text());
            if (!streakType) {
                firstGameResult = gameResult;
                streakType =
                    gameResult === "Victory" ? StreakType.WIN_STREAK : StreakType.LOSS_STREAK;
            }

            if (gameResult === firstGameResult) {
                streak++;
            } else {
                ongoingStreak = false;
            }
        });

        data.streakType = streakType;
        data.streak = streak;

        // Get ranks from previous seasons
        data.pastSeasons = {};
        $(".PastRankList .Item").each((i, seasonDiv) => {
            const text = this.Strip($(seasonDiv).text());
            const [season, rank] = text.split(" ");
            data.pastSeasons[season] = rank;
        });

        if (isEmptyObject(data.pastSeasons)) {
            data.pastSeasons = null;
        }

        return data;
    }
}

export default SummonerStats;
