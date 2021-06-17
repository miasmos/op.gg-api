import SummaryRankedEndpoint from "./summaryRanked";

class SummaryNormal extends SummaryRankedEndpoint {
    params() {
        return {
            type: "normal",
        };
    }
}

export default SummaryNormal;
