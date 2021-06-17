import cheerio from "cheerio";
import Endpoint from "../endpoint";
import { AnalyticsResponse, AnalyticsRankItem, AnalyticsItem } from "../../types";
import StringUtil from "../../util/string";

class Analytics extends Endpoint<{}, AnalyticsResponse> {
    path() {
        return "/champion/statistics";
    }

    parse($: cheerio.Root): AnalyticsResponse {
        const [patchStr] =
            $(".PageDescription .Small")
                .toString()
                .match(/[0-9]*\.[0-9]*/g) || [];
        const patch: number = patchStr ? parseFloat(patchStr) : undefined;
        let winrate: AnalyticsItem = { top: [], jungle: [], middle: [], adc: [], support: [] };
        let pickrate: AnalyticsItem = { top: [], jungle: [], middle: [], adc: [], support: [] };
        let banrate: AnalyticsRankItem[] = [];

        $(".SideContent .ChampionRankingSummary:nth-child(1) .Item").each((i, item) => {
            const $ = cheerio.load(item),
                champions: AnalyticsRankItem[] = [],
                lane = StringUtil.strip($(".Title").text());

            $(".Champion").each((j, item1) => {
                let $ = cheerio.load(item1);
                const place: number = j + 1;
                const name: string = StringUtil.strip($(".Champion .Image").text()).replace(
                    /[0-9]*\. /g,
                    ""
                );

                const [percentStr] =
                    StringUtil.strip($(".Champion a").attr("title")).match(
                        /([0-9]{1,2}\.[0-9]{2})/g
                    ) || [];
                const percent: number = percentStr ? parseFloat(percentStr) : undefined;

                champions.push({ place, name, percent });
            });

            winrate[lane.toLowerCase()] = champions;
        });

        $(".SideContent .ChampionRankingSummary:nth-child(2) .Item").each((i, item) => {
            const $ = cheerio.load(item),
                champions: AnalyticsRankItem[] = [],
                lane = StringUtil.strip($(".Title").text());

            $(".Champion").each((j, item1) => {
                let $ = cheerio.load(item1);
                const place: number = j + 1;
                const name: string = StringUtil.strip($(".Champion .Image").text()).replace(
                    /[0-9]*\. /g,
                    ""
                );

                const [percentStr] =
                    StringUtil.strip($(".Champion a").attr("title")).match(
                        /([0-9]{1,2}\.[0-9]{2})/g
                    ) || [];
                const percent: number = percentStr ? parseFloat(percentStr) : undefined;

                champions.push({ place, name, percent });
            });

            pickrate[lane.toLowerCase()] = champions;
        });

        $(".SideContent .ChampionBanRateSummary .Content .Row").each((i, item) => {
            const $ = cheerio.load(item);
            let champion: AnalyticsRankItem;

            champion.place = i; //first index is a heading
            champion.name = StringUtil.strip($(".ChampionName").text());
            champion.percent = parseFloat($(".Percent").text().replace("%", ""));
            if (!!champion.name) {
                banrate.push(champion);
            }
        });

        return {
            patch,
            winrate,
            pickrate,
            banrate,
        };
    }
}

export default Analytics;
