var request = require('request');
var express = require('express');
var cheerio = require('cheerio');
var http = require('http');
var fs = require('fs');

/* app */
var app = express();
var regions = ['kr','na','euw','eune','oce','br','ru','las','lan','tr'];
var options = {
  url: '',
  headers: {
    'Content-Type': 'text/html',
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36',
    'Accept-Language': 'en-GB,en-US;q=0.8,en;q=0.6',
    'Cookie': 'oldLayout=true'
  }
};

app.param('region', function(req,res,next,id){
  if (regions.indexOf(req.params.region) == -1) {
    res.send({'status':'error','error':'invalid region'});
    return;
  }
  if (req.params.region == 'kr') {req.params.region = 'www';}
  options.region = req.params.region;
  next();
});

app.param('summoner', function(req,res,next,id){
  if (req.params.summoner.length > 16 || req.params.summoner.length < 3) {
    res.send({'status':'error','error':'invalid summoner name'});
    return;
  }
  next();
});

app.param('gamenum', function(req,res,next,id) {
  if (req.params.gamenum % 1 !== 0 || parseInt(req.params.gamenum) < 1000000000) {
    res.send({'status':'error','error':'invalid game number'});
    return;
  }
	options.gamenum = req.params.gamenum;
	next();
});

app.param('summonerId', function(req,res,next,id) {
  if (req.params.summonerId < 10000) {
    res.send({'status':'error','error':'invalid summoner id'});
    return;
  }
	options.summonerId = req.params.summonerId;
	next();
});

app.get('/:region/live', function(req,res){
  res.set('Content-Type', 'application/json');
  options.url = 'http://'+parseURL(req.params.region)+'.op.gg/spectate/pro/';
  console.log("parsing "+options.url);
  request(options,parseLiveFactory(res));
});

app.get('/:region/refresh/:summonerId', function(req,res) {
  res.set('Content-Type', 'application/json');
  options.url = 'http://'+parseURL(req.params.region)+'.op.gg/summoner/ajax/update.json/?summonerId='+parseURL(req.params.summonerId);
  console.log("parsing "+options.url);
  request(options,parseSummonerRefreshFactory(res));
});

app.get('/:region/summoner/:summoner', function(req,res) {
  res.set('Content-Type', 'application/json');
  options.url = 'http://'+parseURL(req.params.region)+'.op.gg/summoner/userName='+parseURL(req.params.summoner);
  console.log("parsing "+options.url);
  request(options,parseSummonerFactory(res));
});

app.get('/:region/summoner/:summoner/champions', function(req,res) {
  res.set('Content-Type', 'application/json');
  options.url = 'http://'+parseURL(req.params.region)+'.op.gg/summoner/champions/userName='+parseURL(req.params.summoner);
  console.log("parsing "+options.url);
  request(options,parseSummonerChampionsFactory(res));
});

app.get('/:region/summoner/:summoner/league', function(req,res) {
  res.set('Content-Type', 'application/json');
  options.url = 'http://'+parseURL(req.params.region)+'.op.gg/summoner/league/userName='+parseURL(req.params.summoner);
  console.log("parsing "+options.url);
  request(options,parseSummonerLeagueFactory(res));
});

app.get('/:region/league', function(req,res) {
  res.set('Content-Type', 'application/json');
  options.url = 'http://'+parseURL(req.params.region)+'.op.gg/ranking/ladder';
  console.log("parsing "+options.url);
  request(options,parseLeagueFactory(res));
});

app.get('/:region/pro', function(req, res) {
  res.set('Content-Type', 'application/json');
  options.url = 'http://'+parseURL(req.params.region)+'.op.gg/spectate/list';
  console.log("parsing "+options.url);
  request(options,parseSpectateListProFactory(res)); 
});

app.get('/:region/amateur', function(req, res) {
  res.set('Content-Type', 'application/json');
  options.url = 'http://'+parseURL(req.params.region)+'.op.gg/spectate/list';
  console.log("parsing "+options.url);
  request(options,parseSpectateListAmateur(res)); 
});

app.get('/:region/spectate/download/:gamenum', function(req,res) {
	res.set('Content-Type', 'text/html');
	options.url = 'http://'+parseURL(req.params.region)+'.op.gg/match/observer/id='+parseURL(req.params.gamenum);
	console.log("parsing "+options.url);

	var rem = request(options);
  	rem.on('response', function(resp) {
	    if (resp.statusCode != '200' || resp.headers['content-type'].indexOf('text/html') > -1) {
	    	res.send({status:'error', error: 'game file not found'});
	    } else {
	    	var file = fs.createWriteStream('../replays/'+req.params.gamenum+'.bat');
	    	rem.pipe(file);
	    	res.send({status:'ok'});
	    }
	});

	console.log("done");
});

http.createServer(app).listen(1337, function() {
  console.log('App started');
});

/* end app */


/* fetch */
function parseLiveFactory(res) {
	function parseLive(err, resp, html) {
	  var $ = cheerio.load(html);
	  var ret = {status:'ok'};
	
	  if (!err) {err = checkForError(html);}
	  if (err) {
	    ret.status = 'error';
	    ret.error = err;
	    res.send(ret);
	    return console.error(err);
	  }
	  
	  ret.data = [];

	  $('div.nBoxContent').each(function(i,item0) {
	    $('div.SpectatorSummoner').each(function(j,item1){
	      var $ = cheerio.load(item1);
	      summoner = {};
	      summoner.champId = stripNewLines($('.championImage').attr('data-championid'));
	      summoner.champName = stripNewLines($('.championName').text());
	      summoner.timestamp = stripNewLines($('._countdown').attr('data-timestamp'));
	      summoner.matchId = stripURL($('a').attr('href'));
	      summoner.name = stripNewLines($('.summonerName').text());
	      summoner.rank = stripNewLines($('.TierRankString').text());
	      summoner.team = stripNewLines($('.summonerTeam').text());
	      summoner.alias = stripNewLines($('.summonerExtra').text());
	      ret.data.push(summoner);
	    });
	  });
	  
	  res.send(ret);
	  console.log('done');
	}
	return parseLive;
}

function parseSummonerFactory(res) {
	function parseSummoner(err, resp, html) {
	  var $ = cheerio.load(html);
	  var ret = {status:'ok'};

	  if (!err) {err = checkForError(html);}
	  if (err) {
	    ret.status = 'error';
	    ret.error = err;
	    res.send(ret);
	    return console.error(err);
	  }
	  
	  ret.data = [];
	  ret.data[0] = {};

	  var recent = {};
	  recent.winRatio = parseInt($('.AverageGameStats .WinRatioText').text().slice(0,-1));

	  var temp = $('.AverageGameStats .WinRatioTitle').text().split('\n');

	  if (temp && temp.length > 0 && temp[2]) {
		  recent.wins = parseInt(temp[2].slice(0,-1));
		  recent.losses = parseInt(temp[3].slice(0,-1));
		  recent.games = parseInt(temp[1].slice(0,-1));
		  recent.kdaKillsAverage = parseFloat($('.AverageGameStats .kda .kill').text());
		  recent.kdaDeathsAverage = parseFloat($('.AverageGameStats .kda .death').text());
		  recent.kdaAssistsAverage = parseFloat($('.AverageGameStats .kda .assist').text());
		  recent.kdaKillsTotal = parseInt($('.AverageGameStats .kdatotal .kill').text());
		  recent.kdaDeathsTotal = parseInt($('.AverageGameStats .kdatotal .death').text());
		  recent.kdaAssistsTotal = parseInt($('.AverageGameStats .kdatotal .assist').text());
		  recent.kdaRatio = parseFloat($('.AverageGameStats .kdaratio .kdaratio').text().slice(0,-2));
		  ret.data[0].recent = recent;

		  var games = [];
		  $('.GameBox').each(function(i,game) {
		    var temp;
		    var $ = cheerio.load(game);
		    game = {};
		    game.type = stripNewLines($('.subType').contents().eq(0).text());
		    game.date = stripNewLines($('._timeago').data('data-datetime'));
		    game.mmr = parseInt(stripNewLines($('.mmr').text()).substring(11));
		    
		    game.length = stripNewLines($('.gameLength').text());
		    game.datetime = stripNewLines($('._timeago').attr('data-datetime'));
		    var gameClass = $('.MetaGameDetail .GameDetail').attr('class');
		    gameClass = gameClass.substring(gameClass.indexOf('-gameId-')+8);
		    game.gameId = stripNewLines(gameClass);
		    game.result = stripNewLines($('.gameResult span').text());
		    game.champion = stripNewLines($('.championName').text());
		    game.championId = $('.championImage').data().championid;
		    game.championImage = stripNewLines($('.championImage img').attr('src'));
		    game.spell1 = stripNewLines($('.spell1 img').attr('src'));
		    game.spell2 = stripNewLines($('.spell2 img').attr('src'));
		    game.kills = parseInt(stripNewLines($('.kda .kill').text()));
		    game.deaths = parseInt(stripNewLines($('.kda .death').text()));
		    game.assists = parseInt(stripNewLines($('.kda .assist').text()));
		    game.ratio = parseFloat(stripNewLines($('.kdaratio .kdaratio').text()).slice(0,-2));
		    game.multikill = stripNewLines($('.multikill .kill').text());
		    game.level = parseInt(stripNewLines($('.level .level').text()));
		    
		    if ($('.observer').length) {
		      temp = stripURL($('.observer a').attr('href'));
		      game.id = temp.replace( /^\D+/g, '');
		    } else {
		      game.id = -1;
		    }

		    temp = stripNewLines($('.cs .cs').text()).split(' (');
		    game.cs = parseInt(temp[0]);
		    if (typeof temp[1] !== 'undefined' ) {game.csps = parseFloat(temp[1].slice(0,-1));}
		    else {game.csps = -1;}
		    game.gold = stripNewLines($('.gold .gold').text());
		    game.wardsGreenBought = parseInt(stripNewLines($('.wards.sight').text()));
		    game.wardsPinkBought = parseInt(stripNewLines($('.wards.vision').text()));

		    var items = [];
		    $('.Items .item32').each(function(j,_item) {
		      var $ = cheerio.load(_item);

		      var item = {};
		      item.name = stripNewLines($('.item32').attr('title'));
		      if (item.name) item.name = item.name.substring(item.name.indexOf(">")+1, item.name.indexOf('</b>'));
		      item.image = $('.item32 .img').css('display');
		      item.slot = j+1;
		      items.push(item);
		    });
		    game.items = items;

		    var trinket = {};
		    trinket.name = stripNewLines($('.ItemsTrinket .item32').attr('original-title'));
		    trinket.image = stripNewLines($('.ItemsTrinket .item32 .img').css('background-image'));
		    trinket.slot = 1;
		    game.items.push(trinket);

		    var players = [];
		    $('.teamId-100 .player').each(function(j,_player) {
		      var $ = cheerio.load(_player);

		      var player = {};
		      if ($('.player-me').length) {game.teamNum = 1; game.teamSide = "Blue"; game.teamSlot = j+1;}
		      player.champion = stripNewLines($('.championIcon').attr('title'));
		      player.championId = $('.championIcon').data().championid;
		      player.championImage = stripNewLines($('.championIcon .img').css('background-image'));
		      player.name = stripNewLines($('.summonerName a').text());
		      players.push(player);
		    });
		    game.team1 = players;

		    var players = [];
		    $('.teamId-200 .player').each(function(j,_player) {
		      var $ = cheerio.load(_player);

		      var player = {};
		      if ($('.player-me').length) {game.teamNum = 2; game.teamSide = "Purple"; game.teamSlot = j+1;}
		      player.champion = stripNewLines($('.championIcon').attr('title'));
		      player.championId = $('.championIcon').data().championid;
		      player.championImage = stripNewLines($('.championIcon .img').css('background-image'));
		      player.name = stripNewLines($('.summonerName a').text());
		      players.push(player);
		    });
		    game.team2 = players;

		    games.push(game);
		  });
		  ret.data[0].games = games;
		  ret.data[0].gameCount = ret.data[0].games.length;
		  ret.data[0].summonerId = parseInt($('.summonerRefreshButton').attr('data-summoner-id'));
		  res.send(ret);
		} else {
			ret.data = false;
			res.send(ret);
		}
		console.log('done');
	}
	return parseSummoner;
}

function parseSummonerRefreshFactory(res) {
	function parseSummonerRefresh(err, resp, html) {
	  var ret = {status:'ok'};
	  if (err) {
	    ret.status = 'error';
	    ret.error = err;
	    res.send(ret);
	    return console.error(err);
	  }

	  var json = JSON.parse(html);
	  if (json.error) {
	  	ret.status = 'error';
	  	ret.error = html.substring(html.indexOf('\\"message\\":\\"')+14, html.indexOf('\\",\\"type\\"'));
	  }
	  
	  res.send(ret);
	  console.log('done');
	}
	return parseSummonerRefresh;
}

function parseSummonerChampionsFactory(res) {
	function parseSummonerChampions(err, resp, html) {
	  var $ = cheerio.load(html);
	  var ret = {status:'ok'};

	  if (!err) {err = checkForError(html);}
	  if (err) {
	    ret.status = 'error';
	    ret.error = err;
	    res.send(ret);
	    return console.error(err);
	  }
	  
	  ret.data = [];
	  $('.ChampionsStatsTable .ChampionStatsTr').each(function(i,item) {
	    var $ = cheerio.load(item);
	    summoner = {};
	    summoner.name = stripNewLines($('.championName').text());
	    summoner.winrate = parseInt(stripNewLines($('.WinRatio .winRatio').text()).slice(0,-1));
	    summoner.wins = parseInt(stripNewLines($('.Wins .wins').text()).slice(0,-1));
	    summoner.losses = parseInt(stripNewLines($('.Losses .losses').text()).slice(0,-1));
	    summoner.kills = parseInt(stripNewLines($('.kill').text()));
	    summoner.deaths = parseInt(stripNewLines($('.death').text()));
	    summoner.assists = parseInt(stripNewLines($('.assist').text()));
	    summoner.kdaratio = Math.round((summoner.kills/summoner.deaths) * 10)/10;
	    summoner.cs = parseInt(stripNewLines($('.cs').text()));
	    summoner.gold = stripNewLines($('.gold').text());
	    summoner.rank = i+1;
	    ret.data.push(summoner);
	  });

	  res.send(ret);
	  console.log('done');
	}
	return parseSummonerChampions;
}

function parseSpectateListProFactory(res) {
	function parseSpectateListPro(err, resp, html) {
	  var $ = cheerio.load(html);
	  var ret = {status:'ok'};

	  if (!err) {err = checkForError(html);}
	  if (err) {
	    ret.status = 'error';
	    ret.error = err;
	    res.send(ret);
	    return console.error(err);
	  }
	  
	  ret.data = [];
	  $('.nContentLayout .SummonerSummary').each(function(i,item) {
	    var $ = cheerio.load(item);
	    summoner = {};
	    summoner.team = stripNewLines($('.summonerTeam').text());
	    if (summoner.team == 'Named') {
	      return false;
	    }
	    summoner.name = stripNewLines($('.summonerName').text());
	    summoner.alias = stripNewLines($('.extra').text());
	    summoner.rank = stripNewLines($('.summonerTierRank .tierRank').text());
	    summoner.lp = stripNewLines($('.tierRank').attr('original-title'));
	    ret.data.push(summoner);
	  });

	  res.send(ret);
	  console.log('done');
	}
	return parseSpectateListPro;
}

function parseSpectateListAmateurFactory(res) {
	function parseSpectateListAmateur(err, resp, html) {
	  var $ = cheerio.load(html);
	  var ret = {status:'ok'};

	  if (!err) {err = checkForError(html);}
	  if (err) {
	    ret.status = 'error';
	    ret.error = err;
	    res.send(ret);
	    return console.error(err);
	  }
	  
	  ret.data = [];
	  $('.nContentLayout .SummonerSummary').each(function(i,item) {
	    var $ = cheerio.load(item);
	    summoner = {};
	    summoner.team = stripNewLines($('.summonerTeam').text());
	    if (summoner.team != 'Named') {
	      return true;
	    }
	    summoner.name = stripNewLines($('.summonerName').text());
	    summoner.alias = stripNewLines($('.extra').text());
	    summoner.rank = stripNewLines($('.summonerTierRank .tierRank').text());
	    summoner.lp = stripNewLines($('.tierRank').attr('original-title'));
	    ret.data.push(summoner);
	  });

	  res.send(ret);
	  console.log('done');
	}
	return parseSpectateListAmateur;
}

function parseSummonerLeagueFactory(res) {
	function parseSummonerLeague(err, resp, html) {
	  var $ = cheerio.load(html);
	    var ret = {status:'ok'};

	  if (!err) {err = checkForError(html);}
	  if (err) {
	    ret.status = 'error';
	    ret.error = err;
	    res.send(ret);
	    return console.error(err);
	  }
	    
	  ret.data = [];
	  ret.data[0] = {};

	  var league = {};
	  league.image = stripNewLines($('.LeagueHeader img').attr('src'));
	  league.rank = stripNewLines($('.LeagueHeader .LeagueRank').text());
	  league.tier = stripNewLines($('.LeagueHeader .LeagueTierRank').text());
	  league.name = stripNewLines($('.LeagueHeader .LeagueName').text());

	  var summoners = [];
	  $('.LeagueContent .LeagueRankTableData').each(function(i,item) {
	    var $ = cheerio.load(item);
	    summoner = {};
	    summoner.rank = parseInt(stripNewLines($('.rank').text()));
	    summoner.change = parseInt(stripNewLines($('.change span').text()));
	    summoner.changeDirection = stripNewLines($('.change span').attr('class'));
	    summoner.name = stripNewLines($('.summonerName').text());
	    summoner.image = stripNewLines($('.summonerImage img').attr('src'));
	    summoner.wins = parseInt(stripNewLines($('.wins').text()));
	    summoner.losses = parseInt(stripNewLines($('.losses').text()));
	    summoner.points = parseInt(stripNewLines($('.LeaguePoints').text()));
	    summoners.push(summoner);
	  });

	  ret.data[0].league = league;
	  ret.data[0].summoners = summoners;
	  res.send(ret);
	  console.log('done');
	}
	return parseSummonerLeague;
}

function parseLeagueFactory(res) {
	function parseLeague(err, resp, html) {
	  var $ = cheerio.load(html);
	  var ret = {status:'ok'};

	  if (!err) {err = checkForError(html);}
	  if (err) {
	    ret.status = 'error';
	    ret.error = err;
	    res.send(ret);
	    return console.error(err);
	  }
	  
	  ret.data = [];
	  $('.RankingTable tr').each(function(i,item) {
	    var $ = cheerio.load(item);
	    summoner = {};
	    summoner.rank = parseInt(stripNewLines($('.Rank').text()));
	    summoner.change = parseInt(stripNewLines($('.rankPreviousPosition').text()));
	    var temp = stripNewLines($('.rankPreviousPosition').attr('class'));
	    if (typeof(temp) !== 'undefined') {
	      if (temp.indexOf('up') > -1) {temp = 1}
	      else if (temp.indexOf('down') > -1) {temp = 0}
	    }
	    summoner.changeDirection = temp;
	    summoner.name = stripNewLines($('.SummonerName .summonerName').text());
	    summoner.image = stripNewLines($('.summonerImage img').attr('src'));
	    summoner.tier = stripNewLines($('.summonerTierRank .tierRank').text());
	    summoner.team = stripNewLines($('.SummonerTeam').text());
	    summoner.wins = parseInt(stripNewLines($('.SummonerWinsLosses .progress .blue').text()));
	    summoner.losses = parseInt(stripNewLines($('.SummonerWinsLosses .progress .red').text()));
	    summoner.ratio = parseFloat(stripNewLines($('.SummonerWinsLosses .winRatio').text()));
	    summoner.points = parseInt(stripNewLines($('.summonerLeaguePoint').text()));

	    var champions = [];
	    $('.Champions .championIcon').each(function(j, champ) {
	      var $ = cheerio.load(champ);

	      var champion = {};
	      var temp = $('div').attr('title').split('<br>');
	      champion.name = temp[0];
	      champion.games = parseInt(temp[1].split(' ')[0]);
	      champion.kda = parseFloat(temp[3].substring(4));

	      temp = temp[2].split('/');
	      champion.kills = parseFloat(temp[0].trim());
	      champion.deaths = parseFloat(temp[1].trim());
	      champion.assists = parseFloat(temp[2].trim());
	      champions.push(champion);
	    });
	    summoner.champions = champions;
	    ret.data.push(summoner);
	  });

	  res.send(ret);
	  console.log('done');
	}
	return parseLeague;
}

function checkForError(html) {
  var $ = cheerio.load(html);
  if ($('.ErrorContainer').length) {return $('.ErrorContainer .message').eq(0).text();}
  return false;
}

function stripNewLines(str) {
  if (typeof(str) === 'undefined' || typeof(str) === 'object') {return str}
  return str.replace(/\r?\n|\r|\t|\n/g,"");
}

function stripURL(str) {
  if (typeof(str) === 'undefined') {return str}
  return str.split('=')[1];
}

function parseURL(url) {
	url = encodeURIComponent(url);
  	return url.replace(/%2B/g, '%20');
}
/* end fetch */
