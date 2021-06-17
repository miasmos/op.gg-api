'use strict'
module.exports = class Utils {
	static Match(regex, string) {
		var regex = new RegExp(regex)
		regex = regex.exec(string)
		if (!!regex) {
			if (regex.length > 1) {
				return regex.splice(1,regex.length)
			} else {
				return true
			}
		} else {
			return false
		}
	}

	static Escape(string) {
		return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
	}

	static IsEndpoint(needle, stack) {
		var regex = this.Escape(needle).replace(/\/:[a-zA-Z0-9]*/g, '\/[0-9a-zA-Z]*')
		return !!this.Match(regex, stack) ? true : false
	}
}