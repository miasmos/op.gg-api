class Validator {
    static region(region) {
        return (
            ["kr", "na", "euw", "eune", "oce", "br", "ru", "las", "lan", "tr"].indexOf(region) > -1
        );
    }

    static summoner(name) {
        return !!name && name.length && name.length <= 16 && name.length >= 3;
    }

    static gameId(gameid) {
        return !!gameid && gameid % 1 == 0 && parseInt(gameid) >= 1000000000;
    }

    static summonerId(id) {
        return !!id && id >= 10000;
    }

    static season(season) {
        return !!season && ((season >= 1 && season <= 7) || season == "normal");
    }

    static apiKey(key) {
        const [result] =
            key.match(/RGAPI-[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/g) || [];
        return result && result.length > 0;
    }

    static timestamp(timestamp) {
        return !!timestamp && parseInt(timestamp) >= 1000000000;
    }

    static statsGraphType(type) {
        return ["win", "lose", "picked", "banned"].indexOf(type) > -1;
    }

    static statsLeague(league) {
        if (league == "all") league = "";
        return (
            ["", "bronze", "silver", "gold", "platinum", "diamond", "master", "challenger"].indexOf(
                league
            ) > -1
        );
    }

    static statsPeriod(time) {
        return ["month", "week", "today"].indexOf(time) > -1;
    }

    static statsMap(map) {
        return [1, 10, 12].indexOf(parseInt(map)) > -1;
    }

    static statsQueueType(queue) {
        return ["ranked", "normal", "aram"].indexOf(queue) > -1;
    }

    static role(role) {
        return ["support", "mid", "adc", "top", "jungle"].indexOf(role) > -1;
    }

    static championName(name) {
        const [result] = name.match(/^[a-zA-Z ']+$/g) || [];
        return result && result.length > 0;
    }
}

export default Validator;
