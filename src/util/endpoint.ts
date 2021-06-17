import StringUtil from "./string";

class EndpointUtil {
    static is(needle, stack) {
        const regex = StringUtil.escape(needle).replace(/\/:[a-zA-Z0-9]*/g, "/[0-9a-zA-Z]*");
        const [result] = stack.match(regex) || [];
        return result && result.length > 0;
    }
}

export default EndpointUtil;
