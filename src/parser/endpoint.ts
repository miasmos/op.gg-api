import Cheerio from "cheerio";
import axios, { AxiosRequestConfig } from "axios";
import { ErrorMessage, Region } from "../enum";
import { OpggParams } from "../types";
import Query from "../util/query";

interface IEndpoint<P extends Object, M extends Object> {
    domain: string;
    headers: { [key: string]: string };
    path: () => string;
    parse: ($: cheerio.Root) => M;
    hasError: ($: cheerio.Root) => Error | boolean;
    request: (params: P) => Promise<M>;
    options: (params: P) => AxiosRequestConfig;
}

class Endpoint<P, M> implements IEndpoint<{}, {}> {
    domain: string = process.env.DOMAIN;
    headers: { [key: string]: string } = {};

    path() {
        return "";
    }

    parse($: cheerio.Root): M {
        throw new Error("Parse function not implemented on this instance of Endpoint");
    }

    hasError($: cheerio.Root): boolean | Error {
        return false;
    }

    async request({ region = Region.NorthAmerica, ...params }: OpggParams = {}): Promise<M> {
        let $: cheerio.Root;
        try {
            const response = await axios(this.options(params));
            $ = Cheerio.load(response.data);
        } catch (error) {
            throw new Error(ErrorMessage.InvalidResponse);
        }

        const error = this.hasError($);
        if (error) {
            throw error as Error;
        }

        const json = this.parse($) as Object | Error;
        if (json instanceof Error) {
            throw json as Error;
        } else if (!json) {
            throw new Error(ErrorMessage.EmptyResponse);
        } else if (typeof json !== "object") {
            throw new Error(ErrorMessage.InvalidResponse);
        }

        return json as M;
    }

    options(params: OpggParams): AxiosRequestConfig {
        return {
            headers: this.headers,
            url: this.url(params),
        };
    }

    url(params: OpggParams = {}) {
        return `${this.domain}?${Query.stringify({
            ...this.params,
            ...params,
        })}`;
    }

    params(): OpggParams {
        return {};
    }
}

export { IEndpoint };
export default Endpoint;
