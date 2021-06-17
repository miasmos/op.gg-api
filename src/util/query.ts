import qs, { ParseOptions, StringifyOptions } from "query-string";

class QueryUtil {
    static parse(query: string, options?: ParseOptions) {
        return qs.parse(query, options);
    }

    static stringify(object: Record<string, any>, options?: StringifyOptions) {
        return qs.stringify(object, options);
    }
}

export default QueryUtil;
