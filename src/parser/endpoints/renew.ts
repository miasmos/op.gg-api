import Endpoint from "./endpoint";
import Error from "../responses/error";

const errorMessages = require("../Responses/error_messages.json"),
    responseCodes = require("../Responses/response_codes.json");

class Renew extends Endpoint {
    path() {
        return "/summoner/ajax/renew.json/";
    }

    errorCheck($) {
        if (!!$) {
            var message = $(".SectionHeadLine");

            if (message.length) {
                message = message.text();
                if (message.indexOf("Cannot find summoner name") > -1) {
                    return new Error(errorMessages.INVALID_SUMMONER, responseCodes.NO_RESULTS);
                } else if (message.indexOf("An error has occurred") > -1) {
                    return new Error(errorMessages.NO_RESULTS, responseCodes.NO_RESULTS);
                } else {
                    return new Error(errorMessages.RATE_LIMITED, responseCodes.TOO_MANY_REQUESTS);
                }
            }

            return new Error(errorMessages.RATE_LIMITED, responseCodes.TOO_MANY_REQUESTS);
        }

        return new Error(errorMessages.INVALID_RESPONSE, responseCodes.ERROR);
    }

    parse($, json) {
        if (!!json) {
            return json;
        }

        return new Error(errorMessages.INVALID_RESPONSE, responseCodes.ERROR);
    }
}

export default Renew;
