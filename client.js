var request = require('request');

function opggClient(opts) {
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
  if (typeof opts !== 'undefined') {if (typeof(opts.host) !== 'undefined') {this.opts.host = opts.host}}
}

opggClient.prototype.request = function(url, callback) {
  var options = this.opts;
  options.url = url;

  request(options, function(error, res, body) {
    if (error) {
      callback({'status':'error','error':error+' when connecting to op.gg-api server'});
      return;
    } else {
      var json = JSON.parse(body);
      if (typeof json.status === 'undefined') {
        callback({'status':'error','error':'return was not json, wtf'});
        return;
      }
      callback(json);
    }
  });
}

/* Public Methods */
opggClient.prototype.Live = function(region, callback){
  var url = 'http://'+this.opts.host+':'+this.opts.port+'/'+region+'/live';
  this.request(url,callback);
}

opggClient.prototype.Summoner = function(region, summoner, callback){
  var url = 'http://'+this.opts.host+':'+this.opts.port+'/'+region+'/summoner/'+summoner;
  this.request(url,callback);
}

opggClient.prototype.SummonerChampions = function(region, summoner, callback){
  var url = 'http://'+this.opts.host+':'+this.opts.port+'/'+region+'/summoner/'+summoner+'/champions';
  this.request(url,callback);
}

opggClient.prototype.SummonerLeague = function(region, summoner, callback){
  var url = 'http://'+this.opts.host+':'+this.opts.port+'/'+region+'/summoner/'+summoner+'/league';
  this.request(url,callback);
}

opggClient.prototype.League = function(region, callback){
  var url = 'http://'+this.opts.host+':'+this.opts.port+'/'+region+'/league';
  this.request(url,callback);
}

opggClient.prototype.GetReplay = function(region, game, callback){
  var url = 'http://'+this.opts.host+':'+this.opts.port+'/'+region+'/spectate/download/'+game;
  this.request(url,callback);
}

opggClient.prototype.ProPlayers = function(region, callback){
  var url = 'http://'+this.opts.host+':'+this.opts.port+'/'+region+'/pro';
  this.request(url,callback);
}

opggClient.prototype.AmateurPlayers = function(region, callback){
  var url = 'http://'+this.opts.host+':'+this.opts.port+'/'+region+'/amateur';
  this.request(url,callback);
}

opggClient.prototype.Refresh = function(region, summonerId, callback){
  var url = 'http://'+this.opts.host+':'+this.opts.port+'/'+region+'/refresh/'+summonerId;
  this.request(url,callback);
}
/* End Public Methods */

module.exports = opggClient;