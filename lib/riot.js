'use strict'
var api = require('leagueapi'),
	Promise = require('bluebird'),
	error = require('./error.json')

class Riot {
	constructor(opts) {
		if (!opts) opts = {}
		this.key = !!opts.key ? opts.key : undefined
		if (!this.key) throw new Error(error.API_KEY_MISSING)
		this.cache = {}
		api.init(this.key)
	}

	Champions() {
		return new Promise((resolve, reject) => {
			if ('ChampionList' in this.cache) {
				resolve(this.cache['ChampionList'])
			} else {
				api.Static.getChampionList({}, (error, champions) => {
					if (error) reject(error)
					else {
						this.cache['ChampionList'] = champions.data
						resolve(champions.data)
					}
				})
			}
		})
	}
}

module.exports = Riot