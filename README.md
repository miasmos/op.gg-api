op.gg-api
=========
Converts live op.gg pages into json endpoints  
<br><br>
Endpoints
==========
/:region/live => http://:region.op.gg/spectate/pro/  
Fetches pro players currently playing.

/:region/pro => http://:region.op.gg/spectate/list  
Fetches pro players registered with op.gg.

/:region/amateur => http://:region.op.gg/spectate/list  
Fetches amateur players registered with op.gg.

/:region/summoner/:summoner => http://:region.op.gg/summoner/userName=:summoner  
Fetches the specified summoner's 15 most recent games data.

/:region/summoner/:summoner/champions => http://:region.op.gg/summoner/champions/userName=:summoner  
Fetches the specified summoner's top 75 played champions in order of most played to least played.

/:region/summoner/:summoner/league => http://:region.op.gg/summoner/league/userName=:summoner  
Fetches the specified summoner's standing in their league as well as the top 200 players in that league.

/:region/league => http://:region.op.gg/ranking/ladder  
Fetches the top 200 players in the specified region.

/:region/spectate/download/:gameID => http://:region.op.gg/match/observer/id=:gameID  
Fetches the spectator bat file associated with the specified game ID  

/:region/refresh/:summonerId => http://:region.op.gg/summoner/ajax/update.json/?summonerId=:summonerId
Refreshes the specified summoner Id's data.
<br>
Dependencies
==========
cheerio  
request  
express  
http
