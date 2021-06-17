import { Region } from "./enum";

class SummonerIdCache {
    ids: {
        [key: string]: {
            [key: string]: string;
        };
    };

    get(region: Region, username: string): string {
        if (!(region in this.ids)) {
            return undefined;
        }
        if (!(username in this.ids[region])) {
            return undefined;
        }
        return this.ids[region][username];
    }

    set(region: Region, username: string, summonerId: string): void {
        if (!(region in this.ids)) {
            this.ids[region] = {};
        }
        this.ids[region][username] = summonerId;
    }
}

export default SummonerIdCache;
