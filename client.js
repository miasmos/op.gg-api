var request = require('request');

function gg(opts) {
  this.opts = {
    url: '',
    port: '1337',
    host: '127.0.0.1',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36',
      'Accept-Language': 'en-GB,en-US;q=0.8,en;q=0.6'
    }
  };
  if (typeof(opts.host) !== 'undefined') {this.opts.host = opts.host}
}

gg.prototype.request = function(url, callback) {
  var options = this.opts;
  options.url = url;

  request(options, function(error, res, body) {
    callback(JSON.parse(body));
  });
}

gg.prototype.Region = function(region, callback){
  var url = 'http://'+this.opts.host+':'+this.opts.port+'/'+region;
  this.request(url,callback);
}

gg.prototype.Summoner = function(region, summoner, callback){
  var url = 'http://'+this.opts.host+':'+this.opts.port+'/'+region+'/summoner/'+summoner;
  this.request(url,callback);
}

gg.prototype.SummonerChampions = function(region, summoner, callback){
  var url = 'http://'+this.opts.host+':'+this.opts.port+'/'+region+'/summoner/'+summoner+'/champions';
  this.request(url,callback);
}

gg.prototype.SummonerLeague = function(region, summoner, callback){
  var url = 'http://'+this.opts.host+':'+this.opts.port+'/'+region+'/summoner/'+summoner+'/league';
  this.request(url,callback);
}

gg.prototype.League = function(region, callback){
  var url = 'http://'+this.opts.host+':'+this.opts.port+'/'+region+'/league';
  this.request(url,callback);
}

gg.prototype.GetReplay = function(region, game, callback){
  var url = 'http://'+this.opts.host+':'+this.opts.port+'/'+region+'/spectate/download/'+game;
  this.request(url,callback);
}

module.exports = opgg;