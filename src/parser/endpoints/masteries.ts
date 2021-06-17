import cheerio from "cheerio";
import Endpoint from "./endpoint";
import Error from "../responses/error";

const errorMessages = require("../Responses/error_messages.json"),
    responseCodes = require("../Responses/response_codes.json");

class Masteries extends Endpoint {
    path() {
        return "/summoner/mastery/";
    }

    errorCheck($) {
        if (!$) return false;
        if ($(".ErrorMessage").length) {
            return new Error(errorMessages.NO_RESULTS, responseCodes.NO_RESULTS);
        }
        return false;
    }

    parse($) {
        var data = [],
            regex = undefined;

        $(".MasteryPageWrap").each((i, element) => {
            var $ = cheerio.load(element),
                masteryContainer = {},
                mastery = {};

            masteryContainer.title = this.Strip($(".MasteryPageName").text());
            masteryContainer.masteries = {};
            mastery.ranks = [];
            $(".MasteryPageArea").each((i, item) => {
                var $ = cheerio.load(item);

                $(".Mastery").each((j, item1) => {
                    var $ = cheerio.load(item1),
                        rank1 = $(".Rank"),
                        rank2 = item1.attribs.class.indexOf("Rank-full") > -1,
                        obj = {};

                    obj.rank = rank1.length ? parseInt(rank1.text()) : rank2 ? 1 : 0;
                    obj.name = item1.attribs.title;
                    obj.name = new RegExp(/>([a-zA-Z \']*)</g).exec(obj.name);
                    obj.name = !!obj.name && obj.name.length ? obj.name[1] : undefined;
                    obj.position = j + 1;
                    mastery.ranks.push(obj);
                });

                mastery.total = $(".Summary");
                regex = new RegExp(/: ([0-9]{1,2})/g).exec(mastery.total);
                mastery.total = !!regex && regex.length ? parseInt(regex[1]) : undefined;
                var title = ["offense", "defense", "utility"][i];
                masteryContainer.masteries[title] = mastery;
                mastery = {};
                mastery.ranks = [];
            });

            if (
                Math.max(
                    masteryContainer.masteries.offense.total,
                    masteryContainer.masteries.defense.total,
                    masteryContainer.masteries.utility.total
                ) > 0
            ) {
                data.push(masteryContainer);
            }
        });
        return data.length ? data : new Error(errorMessages.NO_RESULTS, responseCodes.NO_RESULTS);
    }
}

export default Masteries;
