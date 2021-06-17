import { Region } from "./enum";

interface OpggOptions {
    apiKey?: string;
}

interface OpggParams {
    region?: Region;
}

interface LiveItem {
    timestamp: number;
    gametype: String;
    champion: { name: string; image: string };
    matchId: number;
    name: string;
    team: string;
    teamLogo: string;
    alias: string;
}

type LiveResponse = LiveItem[];

interface SummaryEmptyResponse {
    summonerId: number;
    league: string;
    lp?: number;
    wins?: number;
    losses?: number;
    winRatio?: number;
}

interface Match {
    type: string;
    timestamp: number;
    length: string;
    id: number;
    result: string;
    champion: string;
    championImage: string;
    spell1: string;
    spell1Image: string;
    spell2: string;
    spell2Image: string;
    kills: number;
    deaths: number;
    assists: number;
    ratio: number;
    level: number;
    cs: number;
    csps: number;
    pinksPurchased: number;
    killParticipation: number;
    items: {
        name: string;
        image: string;
        slot: number;
        id: number;
    }[];
    team1: { teamSide: string; teamSlot: number; championName: string; name: string }[];
    team2: { teamSide: string; teamSlot: number; championName: string; name: string }[];
}

interface SummaryResponse {
    summonerId: number;
    league: string;
    lp: number;
    wins: number;
    losses: number;
    winRatio: number;
    recent: {
        winRatio: number;
        wins: number;
        losses;
        number;
        games: number;
        killsAverage: number;
        deathsAverage: number;
        kdaRatio: number;
        killParticipation: number;
    };
    games: Match[];
}

interface Stats {
    rank: number;
    name: string;
    winrate: number;
    cs: number;
    gold: number;
    kda?: number;
    games?: number;
}

interface ChampionsResponse extends Stats {
    wins: number;
    losses: number;
    kills: number;
    deaths: number;
    assists: number;
    ratio: number;
    turrets: number;
    maxKills: number;
    maxDeaths: number;
    damageDealt: number;
    damageTaken: number;
    doubleKill: number;
    tripleKill: number;
    quadraKill: number;
}

interface LeagueResponse {
    range: string;
    name: string;
    summoners: {
        place: number;
        image: string;
        name: string;
        emblems: { veteran: boolean; hot: boolean; recruit: boolean; inactive: boolean };
        wins: number;
        losses: number;
        winRatio: number;
        lp: number;
        series: Object;
    };
}

interface RuneItem {
    image: string;
    name: string;
    effect: string;
    count: number;
}

interface RunesResponse {
    title: string;
    mark: RuneItem[];
    seal: RuneItem[];
    glyph: RuneItem[];
    quintessence: RuneItem[];
}

interface MasteriesItem {
    ranks: MasteriesRank[];
    total: number;
}

interface MasteriesRank {
    rank: number;
    name: string;
    position: number;
}

interface MasteriesResponse {
    title: string;
    masteries: { offense: MasteriesItem; defense: MasteriesItem; utility: MasteriesItem };
}

type MatchesResponse = Match;
type StatsResponse = Stats;

interface AnalyticsRankItem {
    place: number;
    name: string;
    percent: number;
}

interface AnalyticsItem {
    top: AnalyticsRankItem[];
    jungle: AnalyticsRankItem[];
    middle: AnalyticsRankItem[];
    adc: AnalyticsRankItem[];
    support: AnalyticsRankItem[];
}

interface AnalyticsResponse {
    patch: number;
    winrate: AnalyticsItem;
    pickrate: AnalyticsItem;
    banrate: AnalyticsRankItem[];
}

interface AnalyticsByChampionStats {
    pickrate: number;
    pickrateSample: number;
    winrate: number;
    image?: string;
    name?: string;
    id?: number;
}

interface AnalyticsChampionItem {
    image: string;
    name: string;
    id: number;
}

interface AnalyticsChampionMastery {
    total: number;
    ranks: {
        rank: number;
        name: string;
        position: number;
    };
}

interface AnalyticsChampionChart {
    rank: number;
    winrate: number;
    patch?: number;
    date?: string;
}

interface AnalyticsChampionResponse {
    patch: number;
    bankrateRank: number;
    banrate: number;
    roles: {
        role: string;
        rolePercent: number;
        winrateRank: number;
        winrate: number;
        pickrateRank: number;
        pickrate: number;
        position: number;
    }[];
    skills: (AnalyticsByChampionStats & {
        order: { place: number; button: string };
    })[];
    spells: AnalyticsByChampionStats[];
    starterItems: (AnalyticsByChampionStats & { items: AnalyticsChampionItem[] })[];
    coreItems: (AnalyticsByChampionStats & { items: AnalyticsChampionItem[] })[];
    boots: AnalyticsByChampionStats[];
    keystones: AnalyticsByChampionStats[];
    masteries: {
        title: String;
        masteries: {
            offense: AnalyticsChampionMastery;
            defense: AnalyticsChampionMastery;
            utility: AnalyticsChampionMastery;
        };
    };
    runes: (AnalyticsByChampionStats & { items: AnalyticsChampionItem[] })[];
    charts: {
        rank: number;
        winrate: AnalyticsChampionChart;
        pickrate: AnalyticsChampionChart;
        gamelengthwinrate: AnalyticsChampionChart;
    };
}

type AnalyticsChampionItemsResponse = AnalyticsByChampionStats[];

type AnalyticsChampionSkillsResponse = {
    pickrate: number;
    pickrateSample: number;
    winrate: number;
}[];

interface MatchTeamItem {
    players: {
        champion: string;
        level: number;
        spells: {
            spell1Name: string;
            spell1Image: string;
            spell2Name: string;
            spell2Image: string;
        };
        keystone: { name: string; image: string; id: number };
        name: string;
        items: { name: string; image: string; id: number }[];
    };
    result: string;
    color: string;
    kills: number;
    deaths: number;
    assists: number;
    barons: number;
    dragons: number;
    towers: number;
}

interface MatchResponse {
    team1: MatchTeamItem;
    team2: MatchTeamItem;
}

export {
    OpggOptions,
    OpggParams,
    LiveResponse,
    LiveItem,
    SummaryResponse,
    SummaryEmptyResponse,
    ChampionsResponse,
    LeagueResponse,
    RunesResponse,
    MasteriesResponse,
    MatchesResponse,
    MatchResponse,
    MatchTeamItem,
    StatsResponse,
    AnalyticsRankItem,
    AnalyticsItem,
    AnalyticsResponse,
    AnalyticsByChampionStats,
    AnalyticsChampionItem,
    AnalyticsChampionMastery,
    AnalyticsChampionChart,
    AnalyticsChampionResponse,
    AnalyticsChampionItemsResponse,
    AnalyticsChampionSkillsResponse,
};
