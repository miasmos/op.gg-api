import cheerio from "cheerio";
import Endpoint from "../endpoint";
import { LiveResponse } from "../../types";
import StringUtil from "../../util/string";

class Live extends Endpoint<{}, LiveResponse> {
    path() {
        return "/spectate/pro";
    }

    parse($: cheerio.Root): LiveResponse {
        const data: LiveResponse = [];

        $("div.SpectateSummonerList .Item").each((i, item) => {
            const $ = cheerio.load(item);
            const timestamp = Number($(".GameTime ._timeago").attr("data-datetime"));
            const gametype = StringUtil.strip($(".GameType").text());
            const champion = {
                name: StringUtil.strip($(".ChampionName").text()),
                image: StringUtil.strip($(".ChampionImage .Image").attr("src")),
            };
            const [matchIdStr] =
                $(".Actions a:first-child")
                    .attr("onclick")
                    .match(/openSpectate\((\d*)\)/g) || [];
            const matchId = !isNaN(Number(matchIdStr)) ? Number(matchIdStr) : undefined;
            const name = StringUtil.strip($(".SummonerName").text());
            const team = StringUtil.strip($(".TeamName").text());
            const logo = StringUtil.strip($(".TierMedal img").attr("src"));
            const teamLogo = !!logo ? logo : undefined;
            const alias = StringUtil.strip($(".Footer .Extra").text());

            data.push({
                timestamp,
                gametype,
                champion,
                matchId,
                name,
                team,
                teamLogo,
                alias,
            });
        });
        return data;
    }
}

export default Live;
