class StringUtil {
    static escape(str: string) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    static strip(str: string) {
        return !!str ? str.replace(/\n|\r|\t/g, "") : str;
    }
}

export default StringUtil;
