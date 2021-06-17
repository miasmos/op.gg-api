import Live from "./endpoints/live";
// import Renew from "./endpoints/renew";
// import SummonerStats from "./endpoints/summonerStats";
// import SummaryCombined from "./endpoints/summaryCombined";
// import SummaryRanked from "./endpoints/summaryRanked";
// import SummaryNormal from "./endpoints/summaryNormal";
// import Champions from "./endpoints/champions";
// import Leagues from "./endpoints/leagues";
// import Matches from "./endpoints/matches";
// import Match from "./endpoints/match";
// import MatchesByTimestamp from "./endpoints/matchesByTimestamp";
// import Stats from "./endpoints/stats";
// import Analytics from "./endpoints/analytics";
// import AnalyticsByChampion from "./endpoints/analyticsByChampion";
// import AnalyticsByChampionItems from "./endpoints/analyticsByChampionItems";
// import AnalyticsByChampionSkills from "./endpoints/analyticsByChampionsSkills";
// import AnalyticsByChampionRunes from "./endpoints/analyticsByChampionRunes";
// import AnalyticsByChampionMasteries from "./endpoints/analyticsByChampionMasteries";

class EndpointFactory {
    static live() {
        return new Live();
    }

    // static renew() {
    //     return new Renew();
    // }

    // static summonerStats() {
    //     return new SummonerStats();
    // }

    // static summaryCombined() {
    //     return new SummaryCombined();
    // }

    // static summaryRanked() {
    //     return new SummaryRanked();
    // }

    // static summaryNormal() {
    //     return new SummaryNormal();
    // }

    // static champions() {
    //     return new Champions();
    // }

    // static leagues() {
    //     return new Leagues();
    // }

    // static matches() {
    //     return new Matches();
    // }

    // static match() {
    //     return new Match();
    // }

    // static matchesByTimestamp() {
    //     return new MatchesByTimestamp();
    // }

    // static stats() {
    //     return new Stats();
    // }

    // static analytics() {
    //     return new Analytics();
    // }

    // static analyticsByChampion() {
    //     return new AnalyticsByChampion();
    // }

    // static analyticsByChampionItems() {
    //     return new AnalyticsByChampionItems();
    // }

    // static analyticsByChampionSkills() {
    //     return new AnalyticsByChampionSkills();
    // }

    // static analyticsByChampionRunes() {
    //     return new AnalyticsByChampionRunes();
    // }

    // static analyticsByChampionMasteries() {
    //     return new AnalyticsByChampionMasteries();
    // }
}

export default EndpointFactory;
