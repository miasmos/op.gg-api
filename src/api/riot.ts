import axios from "axios";
import { ErrorMessage } from "../enum";

class Riot {
    static domain = "http://ddragon.leagueoflegends.com";
    static patch = process.env.patch || "11.12.1";
    cache: { champions: string[] } = { champions: [] };

    async champions(key: string = process.env.RIOT_API_KEY) {
        if (this.cache.champions.length > 0) {
            return this.champions;
        }

        const response = await axios({
            url: `${Riot.domain}/cdn/${Riot.patch}/data/en_US/champion.json`,
            headers: {
                "X-Riot-Token": key,
            },
        });

        if (!response.data) {
            throw new Error(ErrorMessage.InvalidApiKey);
        }

        this.cache.champions = response.data;
        return response.data;
    }
}

export default Riot;
