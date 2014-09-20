op.gg-api
=========

Converts live op.gg pages into json endpoints


Endpoints
==========

/:region => http://:region.op.gg/spectate/pro/
Fetches pro players currently playing.

/:region/:summoner => http://:region.op.gg/summoner/userName=:summoner
Fetches the specified summoner's 15 most recent games data.

/:region/:summoner/champions => http://:region.op.gg/summoner/champions/userName=:summoner
Fetches the specified summoner's top 75 played champions in order of most played to least played.

/:region/:summoner/league => http://:region.op.gg/summoner/league/userName=:summoner
Fetches the specified summoner's standing in their league as well as the top 200 players in that league.

/:region/league/top => http://:region.op.gg/ranking/ladder
Fetches the top 200 players in the region.


Dependencies
==========

cheerio
request
express
http